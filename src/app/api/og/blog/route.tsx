import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Fallback values
        const title = searchParams.has('title')
            ? searchParams.get('title')?.slice(0, 80)
            : 'LaunchFlow Blog';

        const type = searchParams.has('type')
            ? searchParams.get('type')
            : 'Latest Post';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        backgroundColor: '#f5f2e8',
                        color: '#0c0c0a',
                        padding: '80px 100px',
                        fontFamily: 'sans-serif',
                        border: '20px solid #0c0c0a',
                    }}
                >
                    {/* Top Bar */}
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '4px solid #0c0c0a',
                            paddingBottom: '30px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '32px',
                                fontWeight: 900,
                                letterSpacing: '2px',
                                color: '#0c0c0a',
                            }}
                        >
                            LAUNCHFLOW_
                        </div>
                        <div
                            style={{
                                backgroundColor: '#b8ff00',
                                color: '#0c0c0a',
                                border: '4px solid #0c0c0a',
                                padding: '8px 20px',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                            }}
                        >
                            {type}
                        </div>
                    </div>

                    {/* Main Title */}
                    <div
                        style={{
                            fontSize: '90px',
                            fontWeight: 800,
                            lineHeight: 0.95,
                            textTransform: 'uppercase',
                            maxWidth: '900px',
                            marginTop: '40px',
                        }}
                    >
                        {title}
                    </div>

                    {/* Bottom Bar */}
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            marginTop: 'auto',
                            fontSize: '24px',
                            color: '#888',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                        }}
                    >
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#c94d1e', marginRight: '16px' }}></div>
                        Built for vibecoders — 2025
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.error(e.message);
        return new Response('Failed to generate image', { status: 500 });
    }
}
