import { chromium } from 'playwright'
import { BaseBot } from './base-bot'

export class MicrolaunchBot extends BaseBot {
    async launch(project: any, platform: any): Promise<{ success: boolean; url?: string; error?: string }> {
        let browser
        try {
            browser = await chromium.launch()
            const page = await browser.newPage()

            await page.goto('https://microlaunch.net/submit')

            await page.fill("input[name='name']", project.name)
            await page.fill("input[name='url']", project.website)

            const descObj = await page.$("textarea[name='description']")
            if (descObj) {
                await page.fill("textarea[name='description']", project.description || '')
            }

            const submitObj = await page.$("button[type='submit']")
            if (submitObj) {
                await submitObj.click()
            }

            await page.waitForTimeout(2000)

            return { success: true }
        } catch (e: any) {
            return { success: false, error: e.message }
        } finally {
            if (browser) await browser.close()
        }
    }
}
