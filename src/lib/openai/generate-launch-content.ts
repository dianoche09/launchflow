import OpenAI from 'openai'
import { z } from 'zod'
import { Project } from '@/types'
import { logger } from '../logger'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const LaunchContentSchema = z.object({
    tagline: z.string(),
    short_pitch: z.string(),
    long_pitch: z.string(),
    tags: z.array(z.string()),
    product_hunt_description: z.string(),
    reddit_post: z.string(),
    hn_post: z.string(),
    twitter_thread: z.string(),
})

export type GeneratedLaunchContent = z.infer<typeof LaunchContentSchema>

export async function generateLaunchContent(project: Project): Promise<GeneratedLaunchContent> {
    const prompt = `
    Project Name: ${project.name}
    Website: ${project.website}
    Tagline (if any): ${project.tagline || 'None'}
    Description: ${project.description || 'None'}
    Category: ${project.category || 'None'}

    Generate Launch Content for this startup project.
  `

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `You are a startup launch copywriter. Generate concise, compelling launch content.
        Respond exactly with a JSON object matching this schema:
        {
          "tagline": "A short, punchy tagline",
          "short_pitch": "A 1-2 sentence pitch",
          "long_pitch": "A more detailed 2-3 paragraph pitch",
          "tags": ["startup", "ai", "etc"],
          "product_hunt_description": "Description optimized for Product Hunt (enthusiastic, maker-focused)",
          "reddit_post": "A post optimized for Reddit (r/sideproject - authentic, transparent)",
          "hn_post": "A post optimized for Hacker News (Show HN: ...)",
          "twitter_thread": "A launch thread for Twitter (3-4 tweets separated by new lines)"
        }`,
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) {
        logger.error('Failed to generate content from OpenAI', { projectId: project.id });
        throw new Error('Failed to generate content from OpenAI')
    }

    const parsed = JSON.parse(content)
    logger.info('Launch content generated successfully', { projectId: project.id });

    return LaunchContentSchema.parse(parsed)
}
