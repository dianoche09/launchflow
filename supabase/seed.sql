insert into public.platforms (name, website, submit_url, category, automation_type, automation_difficulty, login_required, priority, seo_value) values
-- Tier 1 Launch Platforms
('Product Hunt', 'https://producthunt.com', 'https://producthunt.com/posts/new', 'launch', 'manual', 'manual', true, 'tier_1', 10),
('BetaList', 'https://betalist.com', 'https://betalist.com/submit', 'launch', 'form', 'medium', false, 'tier_1', 9),
('Uneed', 'https://uneed.best', 'https://uneed.best/submit', 'launch', 'form', 'easy', false, 'tier_1', 8),
('Fazier', 'https://fazier.com', 'https://fazier.com/submit', 'launch', 'form', 'easy', false, 'tier_1', 8),
('Microlaunch', 'https://microlaunch.net', 'https://microlaunch.net/submit', 'launch', 'form', 'easy', false, 'tier_1', 8),
('DevHunt', 'https://devhunt.org', 'https://devhunt.org/submit', 'launch', 'form', 'medium', true, 'tier_1', 8),
('Peerlist', 'https://peerlist.io', 'https://peerlist.io', 'launch', 'manual', 'manual', true, 'tier_1', 7),
('Indie Hackers', 'https://indiehackers.com', 'https://indiehackers.com', 'community', 'manual', 'manual', true, 'tier_1', 9),
('Hacker News', 'https://news.ycombinator.com', 'https://news.ycombinator.com/submit', 'community', 'manual', 'manual', true, 'tier_1', 10),
('SideProjectors', 'https://sideprojectors.com', 'https://sideprojectors.com/submit', 'launch', 'form', 'medium', false, 'tier_2', 6),

-- AI Directories
('There''s an AI for That', 'https://theresanaiforthat.com', 'https://theresanaiforthat.com/submit/', 'ai_directory', 'form', 'easy', false, 'tier_1', 9),
('Futurepedia', 'https://futurepedia.io', 'https://futurepedia.io/submit-tool', 'ai_directory', 'form', 'easy', false, 'tier_1', 9),
('AI Scout', 'https://aiscout.net', 'https://aiscout.net/submit-tool', 'ai_directory', 'form', 'easy', false, 'tier_2', 6),
('AI Valley', 'https://aivalley.ai', 'https://aivalley.ai/submit', 'ai_directory', 'form', 'easy', false, 'tier_2', 5),
('AI Tool Hunt', 'https://aitoolhunt.com', 'https://aitoolhunt.com/submit', 'ai_directory', 'form', 'easy', false, 'tier_2', 5),
('ShowMeBestAI', 'https://showmebest.ai', 'https://showmebest.ai', 'ai_directory', 'form', 'easy', false, 'tier_3', 4),

-- SaaS Directories
('SaaSHub', 'https://saashub.com', 'https://www.saashub.com/submit', 'saas_directory', 'form', 'medium', false, 'tier_1', 8),
('AlternativeTo', 'https://alternativeto.net', 'https://alternativeto.net/software/new/', 'saas_directory', 'manual', 'manual', true, 'tier_1', 9),
('StartupBase', 'https://startupbase.io', 'https://startupbase.io/submit', 'saas_directory', 'form', 'easy', false, 'tier_2', 6),
('PitchWall', 'https://pitchwall.co', 'https://pitchwall.co/submit', 'saas_directory', 'form', 'easy', false, 'tier_2', 5),
('StartupBuffer', 'https://startupbuffer.com', 'https://startupbuffer.com/site/submit', 'saas_directory', 'form', 'easy', false, 'tier_2', 5),
('LaunchingNext', 'https://launchingnext.com', 'https://launchingnext.com/submit', 'saas_directory', 'form', 'easy', false, 'tier_2', 5),
('FoundrList', 'https://foundrlist.com', 'https://foundrlist.com', 'saas_directory', 'form', 'easy', false, 'tier_2', 4),
('ToolFame', 'https://toolfame.com', 'https://toolfame.com/submit', 'saas_directory', 'form', 'easy', false, 'tier_3', 4),
('Firsto', 'https://firsto.xyz', 'https://firsto.xyz/submit', 'saas_directory', 'form', 'easy', false, 'tier_3', 4),
('TinyLaunch', 'https://tinylaunch.co', 'https://tinylaunch.co', 'saas_directory', 'form', 'easy', false, 'tier_3', 3),
('Trendy Startups', 'https://trendystartups.co', 'https://trendystartups.co', 'saas_directory', 'form', 'easy', false, 'tier_3', 3),
('Slocco', 'https://slocco.com', 'https://slocco.com', 'saas_directory', 'form', 'easy', false, 'tier_3', 3),
('Stacker News', 'https://stacker.news', 'https://stacker.news', 'community', 'manual', 'manual', true, 'tier_2', 5),

-- Review Platforms
('G2', 'https://g2.com', 'https://www.g2.com/products/new', 'review', 'manual', 'manual', true, 'tier_1', 10),
('Capterra', 'https://capterra.com', 'https://www.capterra.com/vendors/sign-up/', 'review', 'manual', 'manual', true, 'tier_1', 9),
('GetApp', 'https://getapp.com', 'https://www.getapp.com/vendors/signup', 'review', 'manual', 'manual', true, 'tier_2', 8),

-- Deal Platforms
('AppSumo', 'https://appsumo.com', 'https://appsumo.com/sell/', 'deal', 'manual', 'manual', true, 'tier_1', 9),
('Dealify', 'https://dealify.com', 'https://dealify.com', 'deal', 'manual', 'manual', true, 'tier_2', 6),
('SaaS Mantra', 'https://saasmantra.com', 'https://saasmantra.com', 'deal', 'manual', 'manual', true, 'tier_2', 6),
('LTD Hunt', 'https://ltdhunt.com', 'https://ltdhunt.com', 'deal', 'manual', 'manual', true, 'tier_2', 5),
('SaaSZilla', 'https://saaszilla.co', 'https://saaszilla.co', 'deal', 'manual', 'manual', true, 'tier_2', 5),
('Indie Deals', 'https://indiedeals.io', 'https://indiedeals.io', 'deal', 'manual', 'manual', true, 'tier_3', 3);
