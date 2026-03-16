import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld, processLaunchSubmission } from "@/inngest/functions";

// Create an API that serves zero-dependency functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        helloWorld,
        processLaunchSubmission,
    ],
});
