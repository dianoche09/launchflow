import { LoopsClient } from 'loops';
import { logger } from '../logger';

const loopsApiKey = process.env.LOOPS_API_KEY || 'dummy_loops_key_for_build';
export const loops = new LoopsClient(loopsApiKey);

/**
 * Sends a welcome email or triggers onboarding sequence via Loops.
 */
export async function sendLoopsWelcomeEmail(email: string, firstName: string) {
    try {
        await loops.sendEvent({
            email,
            eventName: 'user_signed_up',
            eventProperties: {
                firstName,
            }
        });
        logger.info('Loops welcome event triggered successfully', { email });
    } catch (err: any) {
        logger.error('Failed to trigger Loops welcome event', { email, error: err.message });
    }
}

/**
 * Triggers launch started event via Loops.
 */
export async function sendLoopsLaunchStartedEmail(email: string, firstName: string, projectName: string) {
    try {
        await loops.sendEvent({
            email,
            eventName: 'launch_started',
            eventProperties: {
                firstName,
                projectName,
            }
        });
        logger.info('Loops launch started event triggered successfully', { email, projectName });
    } catch (err: any) {
        logger.error('Failed to trigger Loops launch started event', { email, error: err.message });
    }
}

/**
 * Triggers launch complete event via Loops.
 */
export async function sendLoopsLaunchCompleteEmail(email: string, firstName: string, projectName: string, approved: number) {
    try {
        await loops.sendEvent({
            email,
            eventName: 'launch_completed',
            eventProperties: {
                firstName,
                projectName,
                approved,
            }
        });
        logger.info('Loops launch complete event triggered successfully', { email, projectName });
    } catch (err: any) {
        logger.error('Failed to trigger Loops launch complete event', { email, error: err.message });
    }
}
