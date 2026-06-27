const BASE = `http://localhost:${process.env.API_SERVER_PORT}/api`

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

const GENRES = [
  { name: 'Bass Boosted', slug: 'bass-boosted', language: 'Global', iconEmoji: '🔊', colorHex: '#7c3aed', bpmRange: '128-160', mood: 'Energetic', tags: 'bass,boosted,bassboost,heavy', videoCount: 24, avgViews: 45000, description: 'Heavy bass boosted tracks for maximum impact' },
  { name: 'Hindi Devotional', slug: 'hindi-devotional', language: 'Hindi', iconEmoji: '🙏', colorHex: '#f59e0b', bpmRange: '70-110', mood: 'Peaceful', tags: 'bhajan,aarti,mandir,prayer', videoCount: 18, avgViews: 32000, description: 'Sacred Hindi devotional songs and bhajans' },
  { name: 'Punjabi Bhangra', slug: 'punjabi-bhangra', language: 'Punjabi', iconEmoji: '💃', colorHex: '#ef4444', bpmRange: '130-160', mood: 'Energetic', tags: 'bhangra,punjabi,desi', videoCount: 15, avgViews: 38000, description: 'High energy Punjabi bhangra remixes' },
  { name: 'English Trance', slug: 'english-trance', language: 'English', iconEmoji: '🌀', colorHex: '#06b6d4', bpmRange: '128-150', mood: 'Euphoric', tags: 'trance,edm,psytrance', videoCount: 12, avgViews: 28000, description: 'Epic trance and EDM experiences' },
  { name: 'Racing Motivation', slug: 'racing-motivation', language: 'Global', iconEmoji: '🏎️', colorHex: '#dc2626', bpmRange: '140-180', mood: 'Adrenaline', tags: 'racing,car,motivation,speed', videoCount: 10, avgViews: 52000, description: 'Adrenaline pumping racing motivation music' },
  { name: 'Gym Workout', slug: 'gym-workout', language: 'Global', iconEmoji: '💪', colorHex: '#16a34a', bpmRange: '120-160', mood: 'Intense', tags: 'gym,workout,fitness,lifting', videoCount: 20, avgViews: 41000, description: 'Maximum energy gym workout music' },
  { name: 'Bhojpuri Remix', slug: 'bhojpuri-remix', language: 'Bhojpuri', iconEmoji: '🎶', colorHex: '#ea580c', bpmRange: '120-140', mood: 'Celebratory', tags: 'bhojpuri,remix,desi,folk', videoCount: 8, avgViews: 18000, description: 'Bhojpuri folk and remix hits' },
  { name: 'English Rap Motivation', slug: 'english-rap-motivation', language: 'English', iconEmoji: '🎤', colorHex: '#1d4ed8', bpmRange: '80-120', mood: 'Powerful', tags: 'rap,hip-hop,motivation,lyrics', videoCount: 14, avgViews: 35000, description: 'Powerful rap and hip-hop motivation tracks' },
  { name: 'Global Trance Remix', slug: 'global-trance-remix', language: 'Global', iconEmoji: '🌍', colorHex: '#7c3aed', bpmRange: '130-155', mood: 'Hypnotic', tags: 'trance,remix,global', videoCount: 9, avgViews: 22000, description: 'Hypnotic global trance remix collection' },
  { name: 'Desi Hip Hop', slug: 'desi-hiphop', language: 'Hindi', iconEmoji: '🎧', colorHex: '#be185d', bpmRange: '85-115', mood: 'Raw', tags: 'desi,hiphop,rap,street', videoCount: 11, avgViews: 27000, description: 'Raw desi hip-hop and rap tracks' },
  { name: 'Spiritual Meditation', slug: 'spiritual-meditation', language: 'Hindi', iconEmoji: '🕉️', colorHex: '#a855f7', bpmRange: '60-90', mood: 'Meditative', tags: 'meditation,spiritual,om,yoga', videoCount: 7, avgViews: 15000, description: 'Peaceful meditation and spiritual music' },
  { name: 'Hindi Pop Remix', slug: 'hindi-pop-remix', language: 'Hindi', iconEmoji: '🎵', colorHex: '#e11d48', bpmRange: '110-135', mood: 'Fun', tags: 'hindi,pop,remix,bollywood', videoCount: 16, avgViews: 33000, description: 'Best Hindi pop remixes and bollywood hits' },
  { name: 'Punjabi Pop', slug: 'punjabi-pop', language: 'Punjabi', iconEmoji: '🎸', colorHex: '#f97316', bpmRange: '100-130', mood: 'Vibrant', tags: 'punjabi,pop,punjabi-pop', videoCount: 13, avgViews: 30000, description: 'Vibrant Punjabi pop music' },
  { name: 'Car Racing Bass', slug: 'car-racing-bass', language: 'Global', iconEmoji: '🏁', colorHex: '#0f172a', bpmRange: '140-180', mood: 'Aggressive', tags: 'racing,car,bass,drift', videoCount: 6, avgViews: 48000, description: 'Aggressive car racing bass tracks' },
  { name: 'Gym Rep Music', slug: 'gym-rep-music', language: 'Global', iconEmoji: '🏋️', colorHex: '#059669', bpmRange: '130-170', mood: 'Maximum', tags: 'gym,rep,sets,power', videoCount: 5, avgViews: 19000, description: 'Maximum rep power gym music' },
  { name: 'Devotional Fusion', slug: 'devotional-fusion', language: 'Global', iconEmoji: '✨', colorHex: '#d97706', bpmRange: '80-120', mood: 'Uplifting', tags: 'devotional,fusion,sacred', videoCount: 4, avgViews: 12000, description: 'Uplifting devotional fusion music' },
]

const SCRIPTS = [
  { videoTitle: '🔊 Bass Boosted Motivation Mix 2025', videoType: 'lyrics', genre: 'Bass Boosted', language: 'Hindi', content: `[Verse 1]\nDuniya kahe ruk ja, tu chalna seekh le\nHaar ke baith ja, ya haar ko dekh le\nDil mein junoon hai, aankhon mein aag hai\nYe waqt badlega, tera apna sag hai\n\n[Chorus]\n🔊 Bass Boosted! Dil se nachle!\nTu rocket ki tarah udd ke chal!\nHaar nahi manunga, jeet ka hai yakeen\nYe duniya meri, main hoon apne haseen!\n\n[Verse 2]\nRaat ka andhera, savere ki kirne\nMehnat ka rang hai, ye sabki birne\nBass boost kar de, volume full kar de\nDuniya ko dikha, tu kaun hai dekh le!`, tags: 'bass,boosted,motivation', duration: '4:30', mood: 'Energetic', status: 'ready' },
  { videoTitle: '🙏 Morning Devotional Mix - Bhajans', videoType: 'lyrics', genre: 'Hindi Devotional', language: 'Hindi', content: `[Intro - Flute]\n\n[Verse 1]\nHey Prabhu teri sharan mein aake\nSukh shanti mil gayi saari\nMandir mein diya jalake\nDil ki baat kahi saari\n\n[Chorus]\nJai Jai Shri Ram\nJai Jai Shri Ram\nBhakto ke tu sahare\nJai Jai Shri Ram\n\n[Verse 2]\nSuno santo ki pukaar\nBhakti ka ye sansar\nNa koi bhed na koi bair\nSab pe tera pyaar\n\n[Outro]\nJai Jai Shri Ram 🙏`, tags: 'bhajan,prayer,morning', duration: '6:00', mood: 'Peaceful', status: 'ready' },
  { videoTitle: '💃 Bhangra Party Mix 2025', videoType: 'lyrics', genre: 'Punjabi Bhangra', language: 'Punjabi', content: `[Intro - Dhol Beat]\n\n[Verse 1 - Punjabi]\nBalle balle shava shava\nNachdi kudi patiala\nBhangra floor te kamm kardi\nSab nu nache de diya\n\n[Chorus - High Energy]\n🔊 Bhangra! Bhangra! Nachiye!\nBalle balle nachiye!\nDJ pe bajhe dhol\nSab nachiye!\n\n[Verse 2]\nPind di kudi aa\nShehar di culture aa\nDesi swag aa\nBalle balle puraa`, tags: 'bhangra,punjabi,party', duration: '3:45', mood: 'Energetic', status: 'ready' },
  { videoTitle: '🏎️ Racing Adrenaline Mix', videoType: 'description', genre: 'Racing Motivation', language: 'English', content: `🎵 RACING ADRENALINE MIX — Maximum Speed Experience

The ultimate car racing motivation mix by BittuSinghOfficialYT! 🔥

🏎️ FEATURES:
✅ Maximum adrenaline racing tracks
✅ Bass boosted engine sounds
✅ Perfect for driving, gym, or gaming
✅ High BPM energy (140-180 BPM)

🔥 TRACK LIST:
0:00 - Intro (Build-up)
0:30 - Track 1: Full Throttle
3:00 - Track 2: Drift King
5:30 - Track 3: Speed Demon
8:00 - Track 4: Final Lap

📱 Follow BittuSinghOfficialYT:
🎵 YouTube: @BittuSinghOfficialYT

#RacingMusic #BassBoosted #CarMusic #Motivation #BittuSinghOfficialYT`, tags: 'racing,car,motivation,speed', duration: '10:00', mood: 'Adrenaline', status: 'ready' },
  { videoTitle: '💪 Gym Beast Mode - Workout Mix', videoType: 'script', genre: 'Gym Workout', language: 'English', content: `🎬 INTRO (0:00 - 0:15)\n- Epic drop intro\n- "Let's go! It's GYM TIME!" 🔥\n- Bass hits hard\n\n📍 WARM-UP PHASE (0:15 - 3:00)\n- Medium tempo tracks (120-130 BPM)\n- Stretching / light warm-up energy\n- Tracks build gradually\n\n💪 MAIN WORKOUT (3:00 - 7:00)\n- High tempo tracks (140-160 BPM)\n- Bass drops every 2 minutes\n- Peak energy moments\n- "NO PAIN NO GAIN"\n\n🏆 FINISHER (7:00 - 8:00)\n- Maximum BPM (160+)\n- Final push energy\n- Victory moment\n\n👋 OUTRO (8:00 - 8:15)\n- "Beast mode activated!"\n- Subscribe reminder\n- Next video teaser`, tags: 'gym,workout,fitness,motivation', duration: '8:15', mood: 'Intense', status: 'ready' },
  { videoTitle: '🌀 Trance Experience - Focus Mix', videoType: 'lyrics', genre: 'English Trance', language: 'English', content: `[Intro - Atmospheric Pad]\n\n[Build-up]\nRising synths, deep bass\nHypnotic melody\n\n[Drop 1]\nFull trance experience\n138 BPM driving beat\nEuphoric leads\n\n[Bridge]\nBreakdown - piano melody\nEmotional vocals\nBuilding tension\n\n[Drop 2 - Peak]\nMaximum energy\nFull festival sound\nHands in the air\n\n[Outro]\nAtmospheric fade\nEchoing synths\nPeaceful resolution`, tags: 'trance,edm,focus,study', duration: '12:00', mood: 'Euphoric', status: 'ready' },
]

const UPLOAD_QUEUE = [
  { videoTitle: '🔊 Bass Boosted Ultimate Mix 2025', genre: 'Bass Boosted', language: 'Global', videoType: 'lyrics', status: 'uploaded', scheduledTime: '2025-06-28T18:00:00', platform: 'YouTube', youtubeUrl: 'https://youtube.com/watch?v=example1', views: 15420, likes: 892 },
  { videoTitle: '💪 Gym Rep Music - Beast Mode', genre: 'Gym Workout', language: 'Global', videoType: 'script', status: 'uploaded', scheduledTime: '2025-06-27T17:00:00', platform: 'YouTube', youtubeUrl: 'https://youtube.com/watch?v=example2', views: 8930, likes: 543 },
  { videoTitle: '🏎️ Racing Car Songs Compilation', genre: 'Racing Motivation', language: 'Global', videoType: 'compilation', status: 'processing', scheduledTime: '2025-06-29T16:00:00', platform: 'YouTube' },
  { videoTitle: '🙏 Morning Bhajans 24/7 Loop', genre: 'Hindi Devotional', language: 'Hindi', videoType: 'lyrics', status: 'pending', scheduledTime: '2025-06-30T05:00:00', platform: 'YouTube' },
  { videoTitle: '💃 Bhangra Remix Party Hits', genre: 'Punjabi Bhangra', language: 'Punjabi', videoType: 'remix', status: 'pending', scheduledTime: '2025-07-01T19:00:00', platform: 'YouTube' },
  { videoTitle: '🌀 Trance Focus Study Mix', genre: 'English Trance', language: 'English', videoType: 'compilation', status: 'uploading', scheduledTime: '2025-06-29T14:00:00', platform: 'YouTube' },
  { videoTitle: '🎧 Desi Hip Hop Street Mix', genre: 'Desi Hip Hop', language: 'Hindi', videoType: 'remix', status: 'pending', scheduledTime: '2025-07-02T18:00:00', platform: 'Instagram Reels' },
  { videoTitle: '🕉️ Meditation Om Chanting', genre: 'Spiritual Meditation', language: 'Hindi', videoType: 'lyrics', status: 'failed', notes: 'Copyright claim on track 3', platform: 'YouTube' },
]

async function seed() {
  console.log('🎵 Seeding genres...')
  for (const g of GENRES) {
    await post('/genres', g)
  }
  console.log(`✅ ${GENRES.length} genres created`)

  console.log('📝 Seeding scripts...')
  for (const s of SCRIPTS) {
    await post('/content-scripts', s)
  }
  console.log(`✅ ${SCRIPTS.length} scripts created`)

  console.log('📤 Seeding upload queue...')
  for (const u of UPLOAD_QUEUE) {
    await post('/upload-queues', u)
  }
  console.log(`✅ ${UPLOAD_QUEUE.length} upload queue items created`)

  console.log('\n🎉 Seed complete!')
}

seed().catch(console.error)
