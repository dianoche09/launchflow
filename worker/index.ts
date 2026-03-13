import { Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { createClient } from '@supabase/supabase-js'
import { MicrolaunchBot } from './bots/microlaunch-bot'
import { FormBot } from './bots/form-bot'

const connection = new Redis(process.env.UPSTASH_REDIS_REST_URL || '')
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')

const worker = new Worker('launch-queue', async job => {
    const { projectId, submissionId, platformId, project, platform } = job.data

    console.log(`Starting submission for: ${project.name} to ${platform.name}`)

    try {
        let result = { success: false, url: '', error: '' }

        if (platform.name === 'Microlaunch') {
            const bot = new MicrolaunchBot()
            result = await bot.launch(project, platform)
        } else if (platform.automation_type === 'form') {
            const bot = new FormBot()
            result = await bot.launch(project, platform)
        } else {
            // Manual or API
            result = { success: true, url: '', error: 'Requires manual submission or different bot' }
        }

        // Update submission
        await supabase.from('submissions').update({
            status: result.success ? (result.url ? 'approved' : 'submitted') : 'failed',
            result_url: result.url || null,
            error_message: result.error || null,
        }).eq('id', submissionId)

        console.log(`Finished ${platform.name} submission | Success: ${result.success}`)
    } catch (err: any) {
        console.error(`Failed job for ${platform.name}`, err)
        await supabase.from('submissions').update({
            status: 'failed',
            error_message: err.message,
        }).eq('id', submissionId)
    }
}, { connection })

console.log('Worker listening to launch-queue...')
