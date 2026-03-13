import { chromium } from 'playwright'
import { BaseBot } from './base-bot'

export class FormBot extends BaseBot {
    async launch(project: any, platform: any): Promise<{ success: boolean; url?: string; error?: string }> {
        if (!platform.submit_url) {
            return { success: false, error: 'No submit URL provided' }
        }

        let browser
        try {
            browser = await chromium.launch()
            const page = await browser.newPage()

            await page.goto(platform.submit_url, { waitUntil: 'domcontentloaded' })

            // Extremely naive generic form filler logic
            const nameSelectors = ["input[name*='name' i]", "input[name*='title' i]"]
            for (const sel of nameSelectors) {
                if (await page.$(sel)) {
                    await page.fill(sel, project.name)
                    break
                }
            }

            const urlSelectors = ["input[name*='url' i]", "input[name*='website' i]"]
            for (const sel of urlSelectors) {
                if (await page.$(sel)) {
                    await page.fill(sel, project.website)
                    break
                }
            }

            const descSelectors = ["textarea[name*='description' i]", "textarea[name*='about' i]"]
            for (const sel of descSelectors) {
                if (await page.$(sel)) {
                    await page.fill(sel, project.description || '')
                    break
                }
            }

            const submitSelectors = ["button[type='submit']", "input[type='submit']"]
            for (const sel of submitSelectors) {
                if (await page.$(sel)) {
                    await page.click(sel)
                    break
                }
            }

            // We wait for navigation safely
            await page.waitForTimeout(3000)

            return { success: true }
        } catch (e: any) {
            return { success: false, error: e.message }
        } finally {
            if (browser) await browser.close()
        }
    }
}
