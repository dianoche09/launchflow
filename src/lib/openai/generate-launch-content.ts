import { z } from 'zod'
import { Project } from '@/types'
import { logger } from '../logger'
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const LaunchContentSchema = z.object({
    tagline: z.string().describe("A short, punchy tagline"),
    short_pitch: z.string().describe("A 1-2 sentence pitch"),
    long_pitch: z.string().describe("A more detailed 2-3 paragraph pitch"),
    tags: z.array(z.string()).describe("List of relevant tags"),
    product_hunt_description: z.string().describe("Description optimized for Product Hunt (enthusiastic, maker-focused)"),
    reddit_post: z.string().describe("A post optimized for Reddit (r/sideproject - authentic, transparent)"),
    hn_post: z.string().describe("A post optimized for Hacker News (Show HN: ...)"),
    twitter_thread: z.string().describe("A launch thread for Twitter (3-4 tweets separated by new lines)"),
})

export type GeneratedLaunchContent = z.infer<typeof LaunchContentSchema>

export async function generateLaunchContent(project: Project): Promise<GeneratedLaunchContent> {
    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.7,
        openAIApiKey: process.env.OPENAI_API_KEY,
    }).withStructuredOutput(LaunchContentSchema);

    const prompt = PromptTemplate.fromTemplate(`
You are a startup launch copywriter. Generate concise, compelling launch content.

Project Name: {name}
Website: {website}
Tagline (if any): {tagline}
Description: {description}
Category: {category}

Generate Launch Content for this startup project.
`);

    const chain = prompt.pipe(model);

    try {
        const response = await chain.invoke({
            name: project.name,
            website: project.website,
            tagline: project.tagline || 'None',
            description: project.description || 'None',
            category: project.category || 'None',
        });

        logger.info('Launch content generated successfully via LangChain', { projectId: project.id });
        return response;
    } catch (err: any) {
        logger.error('Failed to generate content from LangChain', { projectId: project.id, error: err.message });
        throw new Error('Failed to generate content from LangChain');
    }
}
