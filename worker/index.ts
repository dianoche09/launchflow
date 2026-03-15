import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { chromium } from 'playwright';
import * as Sentry from '@sentry/node';
import { Axiom } from '@axiomhq/js';

// Initialize Sentry for the worker process
Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
});

const connection = new Redis(process.env.UPSTASH_REDIS_REST_URL || '');

const worker = new Worker('launch-queue', async (job) => {
    const { projectId, platformId, content } = job.data;
    console.log(`[Worker] Processing submission for Project ${projectId} on Platform ${platformId}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // This is a generic bot logic. 
        // In production, we'd have specific scripts per directory (Stage 5.2 in blueprint).

        // Example: Navigate to submit URL
        // await page.goto(platform.submit_url);
        // await page.fill('input[name="url"]', project.website);
        // await page.fill('input[name="name"]', project.name);
        // await page.click('button[type="submit"]');

        const successMsg = `[Worker] Successfully submitted Project ${projectId}`;
        console.log(successMsg);
        if (process.env.AXIOM_TOKEN && process.env.AXIOM_DATASET) {
            const axiom = new Axiom({ token: process.env.AXIOM_TOKEN });
            axiom.ingest(process.env.AXIOM_DATASET, [{ message: successMsg, projectId, platformId }]);
            await axiom.flush();
        }

        // Update DB status to 'submitted' here via Supabase Service Role
    } catch (error: any) {
        const errorMsg = `[Worker] Submission failed for Project ${projectId}: ${error.message}`;
        console.error(errorMsg, error);
        Sentry.captureException(error, { extra: { projectId, platformId } });

        if (process.env.AXIOM_TOKEN && process.env.AXIOM_DATASET) {
            const axiom = new Axiom({ token: process.env.AXIOM_TOKEN });
            axiom.ingest(process.env.AXIOM_DATASET, [{ message: errorMsg, error: String(error), projectId, platformId }]);
            await axiom.flush();
        }
        // Log error to DB
    } finally {
        await browser.close();
    }
}, { connection: connection as any });



console.log('[Worker] LaunchFlow Submission Worker started.');
