import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    backgroundColor: '#0c0c0a',
                    color: '#f5f2e8',
                    padding: '80px 100px',
                    fontFamily: 'sans-serif', // In production, load custom fonts
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '40px',
                        borderLeft: '4px solid #b8ff00',
                        paddingLeft: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        fontSize: '24px',
                        color: '#b8ff00',
                        fontWeight: 'bold',
                    }}
                >
                    LaunchFlow
                </div>
                <div
                    style={{
                        fontSize: '110px',
                        fontWeight: 800,
                        lineHeight: 0.9,
                        letterSpacing: '-2px',
                        marginBottom: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <span>99+ PLATFORMS.</span>
                    <span style={{ color: '#b8ff00' }}>ONE COMMAND.</span>
                </div>
                <div
                    style={{
                        fontSize: '32px',
                        color: 'rgba(245, 242, 232, 0.6)',
                        lineHeight: 1.4,
                        maxWidth: '800px',
                    }}
                >
                    Automate your startup directory submissions with AI-driven copying and Playwright bots. Stop filling forms. Start shipping.
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
