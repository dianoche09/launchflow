import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pineconeApiKey = process.env.PINECONE_API_KEY || 'pcsk_dummy_key_for_build';
const pineconeIndexName = process.env.PINECONE_INDEX || 'launchflow';

export const pinecone = new Pinecone({
    apiKey: pineconeApiKey,
});

export const getPineconeIndex = () => pinecone.index(pineconeIndexName);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbeddings(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
    });

    return response.data[0].embedding;
}
