import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

const connection = new Redis(process.env.UPSTASH_REDIS_REST_URL || '')

export const launchQueue = new Queue('launch-queue', { connection })

export async function addLaunchJob(data: any) {
    return launchQueue.add('submission', data)
}
