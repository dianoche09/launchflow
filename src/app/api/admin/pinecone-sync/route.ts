import { NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';
import { getPineconeIndex, generateEmbeddings } from '@/lib/pinecone';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
    // 1. Check authorization (simplistic for now)
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    // Fallback: allow internal via secret as well
    const authHeader = req.headers.get('authorization');
    const secret = process.env.SUPABASE_WEBHOOK_SECRET;
    const isInternalValid = authHeader === `Bearer ${secret}` && secret;

    if (!user && !isInternalValid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Fetch all active platforms
        const { data: platforms, error } = await supabase
            .from('platforms')
            .select('*')
            .eq('is_active', true);

        if (error || !platforms) {
            throw new Error(error?.message || 'Failed to fetch platforms');
        }

        logger.info(`Starting Pinecone sync for ${platforms.length} platforms`);

        const index = getPineconeIndex();

        // 3. Process + embed in chunks
        const BATCH_SIZE = 10;
        let syncedCount = 0;

        for (let i = 0; i < platforms.length; i += BATCH_SIZE) {
            const batch = platforms.slice(i, i + BATCH_SIZE);
            const vectors = await Promise.all(
                batch.map(async (platform) => {
                    // Combine relevant text to represent the platform's meaning semantically
                    const textToEmbed = `Name: ${platform.name}. Category: ${platform.category || 'Directory'}. Description: ${platform.description || ''}. Tier: ${platform.tier}`;

                    const embedding = await generateEmbeddings(textToEmbed);

                    return {
                        id: platform.id,
                        values: embedding,
                        metadata: {
                            name: platform.name,
                            category: platform.category || 'Directory',
                            tier: platform.tier,
                            domain: platform.domain || '',
                            is_guided: platform.is_guided || false,
                        }
                    };
                })
            );

            // Upsert the vectors into Pinecone
            await index.upsert(vectors);
            syncedCount += vectors.length;
            logger.info(`Synced ${syncedCount}/${platforms.length} to Pinecone`);
        }

        return NextResponse.json({ success: true, count: syncedCount });

    } catch (err: any) {
        logger.error('Pinecone sync failed', { error: err.message });
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
