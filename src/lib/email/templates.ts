export const EMAIL_STYLE = `
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .email{background:#f5f2e8;border:2px solid #0c0c0a;font-family:'Bricolage Grotesque',Georgia,serif;max-width:600px;margin:0 auto}
    .e-header{background:#0c0c0a;padding:24px 32px;border-bottom:2px solid #0c0c0a}
    .e-logo{font-family:impact,sans-serif;font-size:22px;letter-spacing:2px;color:#b8ff00;text-decoration:none}
    .e-body{padding:40px 32px}
    .e-tag{font-family:monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c94d1e;margin-bottom:16px;display:block}
    .e-h1{font-family:impact,sans-serif;font-size:52px;letter-spacing:2px;line-height:.9;color:#0c0c0a;margin-bottom:16px}
    .e-h1 span{color:#8acc00}
    .e-p{font-size:15px;color:#444;line-height:1.7;margin-bottom:16px}
    .e-divider{height:2px;background:#0c0c0a;margin:28px 0}
    .e-btn{display:inline-block;background:#0c0c0a;color:#b8ff00;font-family:impact,sans-serif;font-size:18px;letter-spacing:1px;padding:14px 28px;text-decoration:none;margin:8px 0}
    .e-list{list-style:none;margin:16px 0}
    .e-list li{padding:8px 0;border-bottom:1px solid #e4e0ce;font-size:14px;color:#555;display:flex;align-items:center;gap:10px}
    .e-list li:last-child{border-bottom:none}
    .e-stat-row{display:flex;gap:0;border:2px solid #0c0c0a;margin:24px 0}
    .e-stat{flex:1;padding:16px;text-align:center;border-right:2px solid #0c0c0a}
    .e-stat:last-child{border-right:none}
    .e-stat-num{font-family:impact,sans-serif;font-size:36px;letter-spacing:1px;line-height:1;color:#0c0c0a}
    .e-stat-num.a{color:#8acc00}
    .e-stat-num.r{color:#c94d1e}
    .e-stat-label{font-family:monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#999;margin-top:4px}
    .e-footer{background:#ede9d8;border-top:2px solid #0c0c0a;padding:20px 32px;display:flex;justify-content:space-between;align-items:center}
    .e-footer-text{font-family:monospace;font-size:10px;color:#aaa;line-height:1.6}
    .e-footer-logo{font-family:impact,sans-serif;font-size:16px;letter-spacing:1px;color:#0c0c0a}
    .e-warning{background:#fff0ec;border:1.5px solid #c94d1e;padding:16px 20px;margin:20px 0}
    .e-warning-title{font-family:monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#c94d1e;margin-bottom:6px}
    .e-warning-text{font-size:13px;color:#666;line-height:1.6}
    .e-credit-bar{height:8px;background:#e4e0ce;margin:8px 0;position:relative}
    .e-credit-fill{height:100%;background:#c94d1e}
  </style>
`;

export function welcomeEmail(firstName: string = 'Founder') {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${EMAIL_STYLE}
    </head>
    <body style="background:#eee;padding:40px 20px;">
      <div class="email">
        <div class="e-header">
          <div class="e-logo">LAUNCHFLOW_</div>
        </div>
        <div class="e-body">
          <span class="e-tag">Welcome</span>
          <div class="e-h1">READY<br>TO <span>LAUNCH.</span></div>
          <p class="e-p">Hey ${firstName},</p>
          <p class="e-p">Welcome to LaunchFlow. You're 3 steps away from submitting your app to 99+ platforms.</p>
          <div class="e-divider"></div>
          <p class="e-p" style="font-weight:600;color:#0c0c0a">Here's how it works:</p>
          <ul class="e-list">
            <li>Add your project — name, URL, description, logo</li>
            <li>Generate your AI launch kit — we write all the copy</li>
            <li>Choose your package — from $9 per launch</li>
            <li>Click launch — we handle the rest</li>
          </ul>
          <div class="e-divider"></div>
          <a href="https://launchflow.io/dashboard/new" class="e-btn">START MY FIRST LAUNCH →</a>
          <p class="e-p" style="margin-top:16px;font-size:13px;color:#888">You have <strong style="color:#0c0c0a">3 free credits</strong> to get started. No credit card needed.</p>
        </div>
        <div class="e-footer">
          <div class="e-footer-logo">LAUNCHFLOW</div>
          <div class="e-footer-text">Built for vibecoders.<br>Unsubscribe · Privacy Policy</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function launchStartedEmail(firstName: string, projectName: string, platformCount: number, autoCount: number, guidedCount: number, launchId: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${EMAIL_STYLE}
    </head>
    <body style="background:#eee;padding:40px 20px;">
      <div class="email">
        <div class="e-header">
          <div class="e-logo">LAUNCHFLOW_</div>
        </div>
        <div class="e-body">
          <span class="e-tag">Launch started</span>
          <div class="e-h1">YOU'RE<br><span>LIVE.</span></div>
          <p class="e-p">Hey ${firstName},</p>
          <p class="e-p"><strong>${projectName}</strong> is now being submitted to ${platformCount} platforms. Sit back — we're handling it.</p>
          <div class="e-stat-row">
            <div class="e-stat"><div class="e-stat-num a">${platformCount}</div><div class="e-stat-label">Platforms</div></div>
            <div class="e-stat"><div class="e-stat-num">${autoCount}</div><div class="e-stat-label">Auto</div></div>
            <div class="e-stat"><div class="e-stat-num r">${guidedCount}</div><div class="e-stat-label">Need you</div></div>
          </div>
          ${guidedCount > 0 ? `
          <div class="e-warning">
            <div class="e-warning-title">${guidedCount} platforms need your action</div>
            <div class="e-warning-text">Platforms like Product Hunt and Reddit require human submission. We've written all the copy. Visit your dashboard to complete them — takes 2–5 minutes each.</div>
          </div>
          ` : ''}
          <a href="https://launchflow.io/launch/${launchId}" class="e-btn">VIEW LIVE STATUS →</a>
        </div>
        <div class="e-footer">
          <div class="e-footer-logo">LAUNCHFLOW</div>
          <div class="e-footer-text">Built for vibecoders.<br>Unsubscribe · Privacy Policy</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function launchCompleteEmail(firstName: string, projectName: string, total: number, approved: number) {
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${EMAIL_STYLE}
    </head>
    <body style="background:#eee;padding:40px 20px;">
      <div class="email">
        <div class="e-header">
          <div class="e-logo">LAUNCHFLOW_</div>
        </div>
        <div class="e-body">
          <span class="e-tag">Launch complete</span>
          <div class="e-h1">LAUNCH<br><span>DONE.</span></div>
          <p class="e-p">Hey ${firstName},</p>
          <p class="e-p"><strong>${projectName}</strong>'s launch is complete. Here's how it went:</p>
          <div class="e-stat-row">
            <div class="e-stat"><div class="e-stat-num">${total}</div><div class="e-stat-label">Submitted</div></div>
            <div class="e-stat"><div class="e-stat-num a">${approved}</div><div class="e-stat-label">Approved</div></div>
            <div class="e-stat"><div class="e-stat-num r">${approvalRate}%</div><div class="e-stat-label">Approval rate</div></div>
          </div>
          <div class="e-divider"></div>
          <a href="https://launchflow.io/dashboard" class="e-btn">VIEW FULL REPORT →</a>
          <p class="e-p" style="margin-top:16px;font-size:13px;color:#888">SEO backlinks take 2–4 weeks to fully index. Check back for traffic data.</p>
        </div>
        <div class="e-footer">
          <div class="e-footer-logo">LAUNCHFLOW</div>
          <div class="e-footer-text">Built for vibecoders.<br>Unsubscribe · Privacy Policy</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function lowCreditsEmail(firstName: string, creditsRemaining: number, creditsUsed: number, creditsTotal: number) {
    const creditPercent = creditsTotal > 0 ? Math.round((creditsUsed / creditsTotal) * 100) : 0;
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${EMAIL_STYLE}
    </head>
    <body style="background:#eee;padding:40px 20px;">
      <div class="email">
        <div class="e-header">
          <div class="e-logo">LAUNCHFLOW_</div>
        </div>
        <div class="e-body">
          <span class="e-tag">Low credits</span>
          <div class="e-h1">CREDITS<br><span>RUNNING</span><br>LOW.</div>
          <p class="e-p">Hey ${firstName},</p>
          <p class="e-p">You have <strong style="color:#c94d1e">${creditsRemaining} credits</strong> remaining. That's enough for a partial launch.</p>
          <div style="margin:20px 0">
            <div style="font-family:monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:6px;display:flex;justify-content:space-between"><span>Credits used</span><span>${creditsUsed} / ${creditsTotal}</span></div>
            <div class="e-credit-bar"><div class="e-credit-fill" style="width:${creditPercent}%"></div></div>
          </div>
          <div class="e-divider"></div>
          <p class="e-p" style="font-weight:600;color:#0c0c0a">Top up your wallet:</p>
          <ul class="e-list">
            <li>19 credits — $9 &nbsp;&nbsp;&nbsp; (Starter Pack)</li>
            <li>49 credits — $19 &nbsp; (Growth Pack) ← most popular</li>
            <li>120 credits — $39 (Builder Pack) ← best value</li>
          </ul>
          <a href="https://launchflow.io/dashboard/plan" class="e-btn">BUY CREDITS →</a>
          <p class="e-p" style="margin-top:16px;font-size:13px;color:#888">Credits never expire. Buy once, use whenever.</p>
        </div>
        <div class="e-footer">
          <div class="e-footer-logo">LAUNCHFLOW</div>
          <div class="e-footer-text">Built for vibecoders.<br>Unsubscribe · Privacy Policy</div>
        </div>
      </div>
    </body>
    </html>
  `;
}
