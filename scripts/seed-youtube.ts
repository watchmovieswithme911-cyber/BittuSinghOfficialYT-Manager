const BASE = 'http://localhost:3001'

async function seed() {
  // Seed Video Ideas
  const ideas = [
    { title: '10 VS Code Extensions Every Developer Needs', description: 'Top extensions that boost productivity for programmers. Cover shortcuts, themes, and debugging tools.', category: 'Tech', priority: 5, estimatedEffort: 'medium', status: 'approved' },
    { title: 'Day in My Life as a YouTuber', description: 'Behind the scenes of creating content, editing, and managing the channel.', category: 'Vlog', priority: 3, estimatedEffort: 'short', status: 'new' },
    { title: 'Build a Full Stack App in 30 Minutes', description: 'Speed coding challenge using React + Node.js. Fast-paced tutorial with real deployment.', category: 'Tutorial', priority: 4, estimatedEffort: 'long', status: 'approved' },
    { title: 'React vs Vue vs Angular — 2026 Comparison', description: 'Updated comparison with latest features, performance benchmarks, and ecosystem maturity.', category: 'Tech', priority: 4, estimatedEffort: 'medium', status: 'new' },
    { title: 'My Setup Tour — Desk, PC & Gear', description: 'Showcase the complete content creation setup with all equipment details.', category: 'Vlog', priority: 2, estimatedEffort: 'short', status: 'approved' },
    { title: 'How I Grew to 10K Subscribers', description: 'Share the journey, strategies, mistakes, and lessons learned growing the channel.', category: 'Growth', priority: 5, estimatedEffort: 'medium', status: 'new' },
    { title: 'Python Automation Scripts for Beginners', description: '5 practical automation scripts that save time — file management, web scraping, email.', category: 'Tutorial', priority: 3, estimatedEffort: 'long', status: 'new' },
    { title: 'React Native App — Full Course', description: 'Complete beginner guide to building mobile apps with React Native and Expo.', category: 'Tutorial', priority: 2, estimatedEffort: 'long', status: 'rejected' },
  ]

  for (const idea of ideas) {
    await fetch(`${BASE}/api/video-ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idea),
    })
  }
  console.log('✅ Seeded video ideas')

  // Seed Videos (Content Calendar)
  const videos = [
    { title: '10 VS Code Extensions Every Developer Needs', status: 'published', scheduledDate: '2026-06-01T00:00:00.000Z', publishedDate: '2026-06-01T00:00:00.000Z', youtubeUrl: 'https://youtube.com/watch?v=example1', views: 15200, likes: 890, tags: 'tech, coding, vscode' },
    { title: 'Build a Full Stack App in 30 Minutes', status: 'published', scheduledDate: '2026-06-08T00:00:00.000Z', publishedDate: '2026-06-08T00:00:00.000Z', youtubeUrl: 'https://youtube.com/watch?v=example2', views: 22400, likes: 1340, tags: 'tutorial, react, node' },
    { title: 'My Setup Tour — Desk, PC & Gear', status: 'filming', scheduledDate: '2026-06-25T00:00:00.000Z', tags: 'vlog, setup, gear' },
    { title: 'React vs Vue vs Angular — 2026 Comparison', status: 'scripting', scheduledDate: '2026-07-01T00:00:00.000Z', tags: 'tech, comparison, frontend' },
    { title: 'How I Grew to 10K Subscribers', status: 'idea', scheduledDate: '2026-07-10T00:00:00.000Z', tags: 'growth, youtube, tips' },
    { title: 'Python Automation Scripts for Beginners', status: 'editing', scheduledDate: '2026-06-20T00:00:00.000Z', tags: 'tutorial, python, automation' },
    { title: 'Day in My Life as a YouTuber', status: 'scheduled', scheduledDate: '2026-06-28T00:00:00.000Z', tags: 'vlog, daily, behind the scenes' },
    { title: 'Git & GitHub Crash Course', status: 'published', scheduledDate: '2026-05-20T00:00:00.000Z', publishedDate: '2026-05-20T00:00:00.000Z', youtubeUrl: 'https://youtube.com/watch?v=example3', views: 8700, likes: 520, tags: 'tutorial, git, github' },
  ]

  for (const video of videos) {
    await fetch(`${BASE}/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(video),
    })
  }
  console.log('✅ Seeded videos')

  // Seed Analytics Snapshots
  const snapshots = [
    { date: '2026-05-01T00:00:00.000Z', subscribers: 8200, totalViews: 180000, watchTimeHours: 890, avgViewDurationMins: 3.8, topVideo: 'Git & GitHub Crash Course' },
    { date: '2026-05-08T00:00:00.000Z', subscribers: 8450, totalViews: 195000, watchTimeHours: 960, avgViewDurationMins: 3.9, topVideo: 'Git & GitHub Crash Course' },
    { date: '2026-05-15T00:00:00.000Z', subscribers: 8700, totalViews: 210000, watchTimeHours: 1020, avgViewDurationMins: 4.0, topVideo: 'Git & GitHub Crash Course' },
    { date: '2026-05-22T00:00:00.000Z', subscribers: 9000, totalViews: 235000, watchTimeHours: 1100, avgViewDurationMins: 4.2, topVideo: '10 VS Code Extensions' },
    { date: '2026-05-29T00:00:00.000Z', subscribers: 9300, totalViews: 260000, watchTimeHours: 1200, avgViewDurationMins: 4.3, topVideo: '10 VS Code Extensions' },
    { date: '2026-06-05T00:00:00.000Z', subscribers: 9650, totalViews: 290000, watchTimeHours: 1310, avgViewDurationMins: 4.4, topVideo: 'Build a Full Stack App in 30 Min' },
    { date: '2026-06-12T00:00:00.000Z', subscribers: 10100, totalViews: 320000, watchTimeHours: 1450, avgViewDurationMins: 4.5, topVideo: 'Build a Full Stack App in 30 Min' },
    { date: '2026-06-19T00:00:00.000Z', subscribers: 10500, totalViews: 350000, watchTimeHours: 1580, avgViewDurationMins: 4.6, topVideo: 'Build a Full Stack App in 30 Min' },
  ]

  for (const snap of snapshots) {
    await fetch(`${BASE}/api/analytics-snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snap),
    })
  }
  console.log('✅ Seeded analytics snapshots')

  // Seed Comments
  const comments = [
    { videoTitle: '10 VS Code Extensions Every Developer Needs', author: 'TechEnthusiast', content: 'This is exactly what I needed! The Vim extension changed my life 🔥', sentiment: 'positive', status: 'new' },
    { videoTitle: '10 VS Code Extensions Every Developer Needs', author: 'CodeNewbie', content: 'Can you make a video on VS Code shortcuts next?', sentiment: 'positive', status: 'responded' },
    { videoTitle: '10 VS Code Extensions Every Developer Needs', author: 'DevRaj', content: 'Prettier should be #1 on the list, not Copilot', sentiment: 'neutral', status: 'new' },
    { videoTitle: 'Build a Full Stack App in 30 Minutes', author: 'WebDevPro', content: 'Incredible speed coding! How do you type so fast?', sentiment: 'positive', status: 'new' },
    { videoTitle: 'Build a Full Stack App in 30 Minutes', author: 'BeginnerDev', content: 'This was too fast for me. Could you do a slower version?', sentiment: 'neutral', status: 'new' },
    { videoTitle: 'Build a Full Stack App in 30 Minutes', author: 'ReactFan', content: 'Best React tutorial on YouTube, hands down! 🙌', sentiment: 'positive', status: 'archived' },
    { videoTitle: 'Git & GitHub Crash Course', author: 'Student2026', content: 'Finally understand git rebase because of this video', sentiment: 'positive', status: 'responded' },
    { videoTitle: 'Git & GitHub Crash Course', author: 'HackerBoy', content: 'The audio quality is really bad in the second half', sentiment: 'negative', status: 'new' },
    { videoTitle: 'Git & GitHub Crash Course', author: 'OpenSourceLover', content: 'Please add more content on git hooks!', sentiment: 'positive', status: 'new' },
    { videoTitle: 'Build a Full Stack App in 30 Minutes', author: 'SkepticalDev', content: 'No way you built that in 30 min, probably pre-recorded', sentiment: 'negative', status: 'archived' },
    { videoTitle: '10 VS Code Extensions Every Developer Needs', author: 'VimUser', content: 'Nice list but missing Vim extension', sentiment: 'neutral', status: 'responded' },
    { videoTitle: 'Build a Full Stack App in 30 Minutes', author: 'FullStackMary', content: 'The deployment section was super helpful, thanks!', sentiment: 'positive', status: 'new' },
  ]

  for (const comment of comments) {
    await fetch(`${BASE}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    })
  }
  console.log('✅ Seeded comments')

  console.log('\n🎉 All sample data seeded successfully!')
}

seed().catch(console.error)
