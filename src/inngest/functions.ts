import { inngest } from "./client";
// import { someJobHandler } from "@/lib/queue/handler";

/**
 * Basic example function for background task processing via Inngest.
 */
export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { event, body: "Hello, World!" };
    }
);

/**
 * Placeholder for the actual launch job migration.
 * When a launch is triggered, Vercel APIs can quickly return while this function
 * runs in the background, circumventing Vercel's 10-second timeout limits.
 */
export const processLaunchSubmission = inngest.createFunction(
    { id: "process-launch-submission" },
    { event: "app/launch.submitted" },
    async ({ event, step }) => {
        const { projectId, platformId, content } = event.data;

        // Wrap the submission logic in a step so it can be automatically retried
        await step.run("execute-submission", async () => {
            console.log(`Executing submission for project ${projectId} on platform ${platformId}`);
            // await executeJob(projectId, platformId, content);
        });

        return { success: true, projectId, platformId };
    }
);
