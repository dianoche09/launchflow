import { Resend } from 'resend';
import { welcomeEmail, launchStartedEmail, launchCompleteEmail as launchCompleteEmailTemplate, lowCreditsEmail } from './templates';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_123');

const FROM = 'LaunchFlow <hello@launchflow.io>';

export async function sendLaunchStartedEmail(to: string, firstName: string, projectName: string, platformCount: number, autoCount: number, guidedCount: number, launchId: string) {
    return resend.emails.send({
        from: FROM,
        to,
        subject: `🚀 ${projectName} is launching to ${platformCount} platforms`,
        html: launchStartedEmail(firstName, projectName, platformCount, autoCount, guidedCount, launchId),
    });
}

export async function sendLaunchCompleteEmail(to: string, firstName: string, projectName: string, total: number, approved: number) {
    return resend.emails.send({
        from: FROM,
        to,
        subject: `✅ ${projectName} — Launch complete.`,
        html: launchCompleteEmailTemplate(firstName, projectName, total, approved),
    });
}

export async function sendWelcomeEmail(to: string, firstName: string) {
    return resend.emails.send({
        from: FROM,
        to,
        subject: 'Welcome to LaunchFlow — ready to ship?',
        html: welcomeEmail(firstName),
    });
}

export async function sendLowCreditsEmail(to: string, firstName: string, creditsRemaining: number, creditsUsed: number, creditsTotal: number) {
    return resend.emails.send({
        from: FROM,
        to,
        subject: '⚠️ LaunchFlow Credits Running Low',
        html: lowCreditsEmail(firstName, creditsRemaining, creditsUsed, creditsTotal),
    });
}
