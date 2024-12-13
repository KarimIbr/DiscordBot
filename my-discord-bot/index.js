require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const SpotifyWebApi = require('spotify-web-api-node');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const roasts = [
    "You're the reason they put instructions on shampoo bottles 🧴",
    "I'd agree with you but then we'd both be wrong 🤷",
    "If laughter is the best medicine, your face must be curing the world 😂",
    "You have so many gaps in your teeth it looks like your tongue is in jail 🦷",
    "You're not stupid, you just have bad luck thinking 🤔",
    "I'd roast you but my mom said I'm not allowed to burn trash 🗑️",
    "You're about as useful as a screen door on a submarine 🚪",
    "You're the human equivalent of a participation award 🏆",
    "I'm not saying I'm Batman, but have you ever seen me and Batman in the same room? 🦇",
    "You're like Monday - nobody likes you 📅",
    "WHAT WHAT WHAT WHAT WHAT YOU'RE ASS KID",
    "You know what I won't roast you this time love you pooks",
    "I miss Isagi too much to roast you"
];

const egoQuotes = [
    "Devour your opponents with all your might! 🐺",
    "Destroy everything. That's what makes you the strongest! 💥",
    "Your hunger is your weapon! 🔥",
    "Become a monster that devours all! 👹",
    "Show them what it means to be a striker! ⚽",
    "Your ego is your greatest strength! 💪",
    "Break through your limits! 🌟",
    "There's no room for friendship on the field! 🚫",
    "Only the hungriest will survive! 🦁",
    "Show them your true ego! ✨"
];

const strikerFacts = [
    "Yoichi Isagi's weapon is Spatial Awareness 👁️",
    "Meguru Bachira plays with his 'monster' 👾",
    "Rensuke Kunigami came back as a 'wild card' 🃏",
    "Seishiro Nagi learned football in just 3 months! ⚡",
    "Rin Itoshi is known as the 'perfect striker' 💯",
    "Shoei Barou calls himself the 'King' 👑",
    "Hyoma Chigiri has incredible speed 🏃‍♂️",
    "Wataru Kuon is the data expert 📊",
    "Tabito Karasu is known as the 'Philosopher' 🤔",
    "Jinpachi Ego is the master of creating egoist strikers 🎭"
];

const playerStats = {
    'Isagi': { shooting: 85, speed: 75, technique: 80, power: 75, spatial: 95 },
    'Bachira': { shooting: 80, speed: 90, technique: 95, power: 70, dribble: 95 },
    'Chigiri': { shooting: 75, speed: 99, technique: 85, power: 65, acceleration: 99 },
    'Kunigami': { shooting: 90, speed: 75, technique: 70, power: 95, leftFoot: 95 },
    'Nagi': { shooting: 85, speed: 70, technique: 99, power: 75, control: 95 },
    'Barou': { shooting: 95, speed: 85, technique: 80, power: 90, ego: 99 },
    'Rin': { shooting: 95, speed: 90, technique: 95, power: 85, perfect: 95 },
    'Shidou': { shooting: 99, speed: 85, technique: 90, power: 90, instinct: 95 },
    'Reo': { shooting: 80, speed: 85, technique: 85, power: 85, copy: 95 },
    'Karasu': { shooting: 85, speed: 85, technique: 90, power: 80, analysis: 95 }
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN
});

// Refresh Spotify access token periodically
async function refreshSpotifyToken() {
    try {
        const data = await spotifyApi.refreshAccessToken();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('Spotify token refreshed');
        // Refresh token every 30 minutes
        setTimeout(refreshSpotifyToken, 30 * 60 * 1000);
    } catch (err) {
        console.error('Could not refresh Spotify token:', err);
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    refreshSpotifyToken();
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Check if message starts with NB! but isn't a valid command
    if (message.content.startsWith('NB!')) {
        const commandPart = message.content.split(' ')[0].toLowerCase();
        
        // List of valid commands (just the command part)
        const validCommands = ['nb!hello', 'nb!ping', 'nb!server', 'nb!song', 'nb!all', 'nb!roast', 'nb!flip', 'nb!8ball', 'nb!userinfo', 'nb!meme', 'nb!poll', 'nb!ego', 'nb!striker', 'nb!match', 'nb!anime', 'nb!recent', 'nb!topsongs', 'nb!artist', 'nb!playlist', 'nb!randomtop', 'nb!randommid', 'nb!randomjung', 'nb!randombot', 'nb!randomsupp', 'nb!lolinfo'];
        
        // If the command isn't in our valid commands list
        if (!validCommands.includes(commandPart)) {
            await message.reply(`❌ "${commandPart}" is not a valid command. Use \`NB!all\` to see all available commands.`);
            return;
        }
    }

    // Existing commands...
    if (message.content === 'NB!hello') {
        await message.reply('Hello there!');
    }
    
    if (message.content === 'NB!ping') {
        await message.reply(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms`);
    }
    
    if (message.content === 'NB!server') {
        await message.reply(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }

    // New help command to show all commands
    if (message.content === 'NB!all') {
        const commands = `
🤖 **Discord Bot Commands**

🎮 **General Commands:**
\`NB!hello\` - Get a friendly greeting
\`NB!ping\` - Check bot latency
\`NB!server\` - Get server information
\`NB!userinfo [@user]\` - Get user information

🎯 **Fun Commands:**
\`NB!roast @user\` - Generate a playful roast for someone
\`NB!flip\` - Flip a coin
\`NB!8ball <question>\` - Ask the magic 8-ball
\`NB!meme\` - Get a random meme
\`NB!poll <question>\` - Create a yes/no poll

🎵 **Music Commands:**
\`NB!song\` - Show currently playing Spotify track
\`NB!recent\` - Show your 5 recently played tracks
\`NB!topsongs\` - Show your top 5 songs this month
\`NB!artist <name>\` - Get information about an artist
\`NB!playlist\` - Show your top 5 playlists

⚽ **Blue Lock Commands:**
\`NB!ego\` - Get a random Ego quote
\`NB!striker\` - Learn a Blue Lock striker fact
\`NB!match\` - Simulate a Blue Lock match

🎌 **Anime Commands:**
\`NB!anime\` - Get a random anime recommendation

🎮 **League of Legends Commands:**
\`NB!randomtop\` - Get a random Top champion
\`NB!randommid\` - Get a random Mid champion
\`NB!randomjung\` - Get a random Jungle champion
\`NB!randombot\` - Get a random Bot champion
\`NB!randomsupp\` - Get a random Support champion
\`NB!lolinfo <champion>\` - Get detailed information about a specific champion

❓ **Help:**
\`NB!all\` - Show this command list`;
        
        await message.reply(commands);
    }

    // Spotify command
    if (message.content === 'NB!song') {
        try {
            const data = await spotifyApi.getMyCurrentPlayingTrack();
            
            if (data.body && data.body.item) {
                const track = data.body.item;
                const response = `
🎵 Currently playing: ${track.name}
👤 By: ${track.artists.map(artist => artist.name).join(', ')}
🔗 Link: ${track.external_urls.spotify}`;
                await message.reply(response);
            } else {
                await message.reply('No track currently playing on Spotify.');
            }
        } catch (err) {
            console.error('Error getting Spotify track:', err);
            await message.reply('Error getting current track information.');
        }
    }

    // Add this to your message handler, before the Spotify command
    if (message.content.startsWith('NB!roast')) {
        const mentionedUser = message.mentions.users.first();
        if (!mentionedUser) {
            await message.reply('Please mention a user to roast! Usage: `NB!roast @username`');
            return;
        }

        // Don't roast the bot itself
        if (mentionedUser.id === client.user.id) {
            await message.reply("Nice try, but I'm not roasting myself! 😎");
            return;
        }

        // Get random roast
        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
        await message.reply(`Hey ${mentionedUser}, ${randomRoast}`);
    }

    // 1. Coin Flip Command
    if (message.content === 'NB!flip') {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        await message.reply(`🪙 Coin flip result: **${result}**!`);
    }

    // 2. 8-Ball Command
    if (message.content.startsWith('NB!8ball')) {
        const question = message.content.slice(8).trim();
        if (!question) {
            await message.reply('Please ask a question! Usage: `NB!8ball Will I win today?`');
            return;
        }
        
        const responses = [
            "It is certain 🎱",
            "Without a doubt ✨",
            "Don't count on it 🚫",
            "Ask again later 🤔",
            "My sources say no 📚",
            "Outlook good 👍",
            "Very doubtful ❌",
            "Yes definitely 💫",
            "Better not tell you now 🤐",
            "Cannot predict now 🌫️"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await message.reply(`Question: ${question}\n🎱 Answer: ${randomResponse}`);
    }

    // 3. User Info Command
    if (message.content.startsWith('NB!userinfo')) {
        const target = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(target.id);
        const roles = member.roles.cache
            .filter(role => role.name !== '@everyone')  // Exclude @everyone role
            .map(r => r.name)
            .join(', ');
            
        const response = `
👤 **User Info for ${target.username}**
🆔 ID: ${target.id}
📅 Account Created: ${target.createdAt.toDateString()}
📆 Joined Server: ${member.joinedAt.toDateString()}
🎭 Roles: ${roles || 'No roles'}`;  // Show 'No roles' if user has no roles besides @everyone
        await message.reply(response);
    }

    // 4. Random Meme Command
    if (message.content === 'NB!meme') {
        try {
            const response = await fetch('https://meme-api.com/gimme');
            const data = await response.json();
            
            await message.reply({
                content: `📸 **${data.title}**`,
                embeds: [{
                    image: {
                        url: data.url
                    }
                }]
            });
        } catch (err) {
            console.error('Error fetching meme:', err);
            await message.reply('Failed to fetch meme 😢');
        }
    }

    // 5. Poll Creator
    if (message.content.startsWith('NB!poll')) {
        const question = message.content.slice(8).trim();
        if (!question) {
            await message.reply('Please provide a question! Usage: `NB!poll Should we play games today?`');
            return;
        }
        const poll = await message.channel.send(`📊 **Poll:** ${question}`);
        await poll.react('👍');
        await poll.react('👎');
    }

    // Blue Lock Ego Quote Command
    if (message.content === 'NB!ego') {
        const randomQuote = egoQuotes[Math.floor(Math.random() * egoQuotes.length)];
        await message.reply(`**Jinpachi Ego says:** ${randomQuote}`);
    }

    // Blue Lock Striker Facts Command
    if (message.content === 'NB!striker') {
        const randomFact = strikerFacts[Math.floor(Math.random() * strikerFacts.length)];
        await message.reply(`**Blue Lock Fact:** ${randomFact}`);
    }

    // Blue Lock Match Simulator
    if (message.content === 'NB!match') {
        const players = Object.keys(playerStats);
        const player1 = players[Math.floor(Math.random() * players.length)];
        const player2 = players[Math.floor(Math.random() * players.length)];
        
        // Calculate match events based on player stats
        const events = [];
        let score1 = 0;
        let score2 = 0;
        
        // Simulate 5 key moments
        for(let i = 0; i < 5; i++) {
            const minute = Math.floor(Math.random() * 90) + 1;
            const attacker = Math.random() < 0.5 ? player1 : player2;
            const defender = attacker === player1 ? player2 : player1;
            
            const attackerStats = playerStats[attacker];
            const defenderStats = playerStats[defender];
            
            // Calculate success chance based on stats
            const attackPower = (attackerStats.shooting + attackerStats.technique) / 2;
            const defensePower = (defenderStats.speed + defenderStats.power) / 2;
            
            const success = Math.random() * attackPower > Math.random() * defensePower;
            
            if (success) {
                // Generate random event description
                const eventTypes = [
                    `${attacker} uses their special ability and scores! ⚡`,
                    `${attacker} breaks through ${defender}'s defense! 💥`,
                    `Amazing shot by ${attacker}! 🎯`,
                    `${attacker}'s ego explodes into a goal! 🔥`,
                    `${defender} couldn't stop ${attacker}'s technique! 🌟`
                ];
                const eventDesc = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                events.push(`⏱️ ${minute}' - ${eventDesc}`);
                
                if (attacker === player1) score1++;
                else score2++;
            } else {
                const missTypes = [
                    `${defender} perfectly blocks ${attacker}'s attempt! 🛡️`,
                    `${attacker}'s shot misses the goal! 😮`,
                    `${defender}'s defense was too strong! 💪`,
                    `${attacker} loses the ball! ❌`,
                    `${defender} shows their true ego! 🔥`
                ];
                const missDesc = missTypes[Math.floor(Math.random() * missTypes.length)];
                events.push(`⏱️ ${minute}' - ${missDesc}`);
            }
        }
        
        // Sort events by minute
        events.sort((a, b) => {
            const minuteA = parseInt(a.split("'")[0].split(' ')[1]);
            const minuteB = parseInt(b.split("'")[0].split(' ')[1]);
            return minuteA - minuteB;
        });

        const result = `
⚽ **Blue Lock Match Simulation**
🔵 ${player1} vs ${player2} 🔵

📊 **Player Stats Comparison:**
${player1}:
⚽ Shooting: ${playerStats[player1].shooting}
🏃 Speed: ${playerStats[player1].speed}
✨ Technique: ${playerStats[player1].technique}
💪 Power: ${playerStats[player1].power}

${player2}:
⚽ Shooting: ${playerStats[player2].shooting}
🏃 Speed: ${playerStats[player2].speed}
✨ Technique: ${playerStats[player2].technique}
💪 Power: ${playerStats[player2].power}

**Match Events:**
${events.join('\n')}

**Final Score:** ${player1} ${score1} - ${score2} ${player2}
${score1 > score2 ? `${player1} wins with pure ego! 🏆` : 
 score2 > score1 ? `${player2} devours the match! 🏆` : 
 'A draw! Both players must strengthen their ego! 🤝'}`;
        
        await message.reply(result);
    }

    // Add the new anime command
    if (message.content === 'NB!anime') {
        try {
            const apiResponse = await fetch('https://api.jikan.moe/v4/random/anime');
            const data = await apiResponse.json();
            const anime = data.data;

            // Format genres
            const genres = anime.genres.map(g => g.name).join(', ');
            
            // Format score (if no score, show "Not rated")
            const score = anime.score ? `${anime.score}/10` : 'Not rated';
            
            const response = {
                content: `
📺 **${anime.title}** ${anime.title_japanese ? `(${anime.title_japanese})` : ''}
⭐ **Rating:** ${score}
🎭 **Genres:** ${genres}
📅 **Year:** ${anime.year || 'Unknown'}
📊 **Status:** ${anime.status}
📝 **Synopsis:** ${anime.synopsis?.slice(0, 200)}...

🔗 More info: ${anime.url}`,
                embeds: []
            };

            // Add image as embed if available
            if (anime.images?.jpg?.image_url) {
                response.embeds.push({
                    image: {
                        url: anime.images.jpg.image_url
                    }
                });
            }

            await message.reply(response);
        } catch (err) {
            console.error('Error fetching anime:', err);
            await message.reply('Failed to fetch anime information 😢');
        }
    }

    // 1. Recently Played Tracks
    if (message.content === 'NB!recent') {
        try {
            const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 });
            const tracks = data.body.items;
            
            const response = `
🎵 **Recently Played Tracks:**
${tracks.map((track, index) => 
    `${index + 1}. **${track.track.name}** - ${track.track.artists.map(a => a.name).join(', ')}`
).join('\n')}`;
            
            await message.reply(response);
        } catch (err) {
            console.error('Error getting recent tracks:', err);
            await message.reply('Error getting recently played tracks.');
        }
    }

    // 2. Top Songs
    if (message.content === 'NB!topsongs') {
        try {
            const data = await spotifyApi.getMyTopTracks({ limit: 5, time_range: 'short_term' });
            const tracks = data.body.items;
            
            const response = `
👑 **Your Top 5 Songs This Month:**
${tracks.map((track, index) => 
    `${index + 1}. **${track.name}** - ${track.artists.map(a => a.name).join(', ')}`
).join('\n')}`;
            
            await message.reply(response);
        } catch (err) {
            console.error('Error getting top tracks:', err);
            await message.reply('Error getting top tracks.');
        }
    }

    // 3. Artist Info
    if (message.content.startsWith('NB!artist')) {
        const artistName = message.content.slice(9).trim();
        if (!artistName) {
            await message.reply('Please provide an artist name! Usage: `NB!artist Drake`');
            return;
        }
        
        try {
            const data = await spotifyApi.searchArtists(artistName);
            const artist = data.body.artists.items[0];
            
            if (artist) {
                // Send artist info
                await message.reply(`
🎤 **Artist Info: ${artist.name}**
👥 Followers: ${artist.followers.total.toLocaleString()}
🎵 Genres: ${artist.genres.join(', ') || 'No genres listed'}
⭐ Popularity: ${artist.popularity}/100`);

                // Send Spotify preview
                await message.channel.send(`https://open.spotify.com/artist/${artist.id}`);
            } else {
                await message.reply('Artist not found.');
            }
        } catch (err) {
            console.error('Error getting artist info:', err);
            await message.reply('Error getting artist information.');
        }
    }

    // 4. User's Playlists
    if (message.content === 'NB!playlist') {
        try {
            const data = await spotifyApi.getUserPlaylists();
            const playlists = data.body.items.slice(0, 5);
            
            const response = `
📀 **Your Top 5 Playlists:**
${playlists.map((playlist, index) => 
    `${index + 1}. **${playlist.name}** - ${playlist.tracks.total} tracks`
).join('\n')}`;
            
            await message.reply(response);
        } catch (err) {
            console.error('Error getting playlists:', err);
            await message.reply('Error getting playlist information.');
        }
    }

    // Replace the enhanced random champion command with this version
    // Replace the random champion command with this fixed version
// Replace the random champion command with this fixed version
// Replace the random champion command with this fixed version
if (message.content.startsWith('NB!random')) {
    let role;
    
    // Handle both command formats
    if (message.content === 'NB!randomtop') role = 'top';
    else if (message.content === 'NB!randommid') role = 'mid';
    else if (message.content === 'NB!randomjung') role = 'jung';
    else if (message.content === 'NB!randombot') role = 'bot';
    else if (message.content === 'NB!randomsupp') role = 'supp';
    else role = message.content.slice(8).toLowerCase().trim(); // For 'NB!random top' format
    
    try {
        // Get latest version and champion data from Data Dragon
        const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionResponse.json();
        const latestVersion = versions[0];

        // Get champion list first
        const championsResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
        const champData = await championsResponse.json();
        const champions = Object.values(champData.data);

        // Filter champions by role (tags)
        const roleMap = {
            'top': ['Fighter', 'Tank'],
            'mid': ['Mage', 'Assassin'],
            'jung': ['Fighter', 'Tank', 'Assassin'],
            'bot': ['Marksman'],
            'supp': ['Support', 'Mage']
        };

        if (!roleMap[role]) {
            await message.reply('Invalid role! Use: top, mid, jung, bot, or supp');
            return;
        }

        const validChamps = champions.filter(champ => 
            champ.tags.some(tag => roleMap[role].includes(tag))
        );

        if (validChamps.length === 0) {
            await message.reply('No champions found for this role.');
            return;
        }

        // Get random champion
        const champion = validChamps[Math.floor(Math.random() * validChamps.length)];

        // Get detailed champion data
        const detailedChampResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${champion.id}.json`);
        const detailedChampData = await detailedChampResponse.json();
        const detailedChamp = detailedChampData.data[champion.id];

        const response = {
            content: `
🎮 **Random ${role.toUpperCase()} Champion: ${champion.name}**
*${champion.title}*

💪 **Stats:**
❤️ Health: ${champion.stats.hp} (+${champion.stats.hpperlevel}/level)
⚔️ Attack: ${champion.stats.attackdamage} (+${champion.stats.attackdamageperlevel}/level)
🛡️ Armor: ${champion.stats.armor} (+${champion.stats.armorperlevel}/level)
✨ Difficulty: ${champion.info.difficulty}/10

📝 **Lore:**
${champion.blurb || ''}

🎯 **Abilities:**
Passive: ${detailedChamp.passive.name}
Q: ${detailedChamp.spells[0].name}
W: ${detailedChamp.spells[1].name}
E: ${detailedChamp.spells[2].name}
R: ${detailedChamp.spells[3].name}`,
            embeds: [{
                image: {
                    url: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`
                }
            }]
        };

        await message.reply(response);

    } catch (err) {
        console.error('Error getting champion data:', err);
        await message.reply('Error getting champion information.');
    }
}
    // Add the lolinfo command
    if (message.content.startsWith('NB!lolinfo')) {
        const championName = message.content.slice(11).trim();
        if (!championName) {
            await message.reply('Please provide a champion name! Usage: `NB!lolinfo Yasuo`');
            return;
        }
    
        try {
            const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
            const versions = await versionResponse.json();
            const latestVersion = versions[0];
    
            const championsResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
            const champData = await championsResponse.json();
            
            // Debug log
            console.log('Searching for:', championName);
            
            // Find champion by name (case-insensitive)
            const searchName = championName.toLowerCase();
            const championId = Object.keys(champData.data).find(key => {
                const champion = champData.data[key];
                return key.toLowerCase() === searchName || 
                       champion.name.toLowerCase() === searchName;
            });
    
            if (!championId) {
                // Instead of showing all champions, show similar ones
                const similarChamps = Object.values(champData.data)
                    .filter(champ => 
                        champ.name.toLowerCase().includes(searchName) ||
                        searchName.includes(champ.name.toLowerCase())
                    )
                    .map(champ => champ.name)
                    .slice(0, 5);
    
                const suggestion = similarChamps.length > 0 
                    ? `\nDid you mean: ${similarChamps.join(', ')}?`
                    : '';
    
                await message.reply(`Champion "${championName}" not found.${suggestion}\nPlease check the spelling and try again!`);
                return;
            }

            // Get detailed champion data
            const detailedChampResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${championId}.json`);
            const detailedChampData = await detailedChampResponse.json();
            const champion = detailedChampData.data[championId];

            const response = {
                content: `
🎮 **Champion Info: ${champion.name}**
*${champion.title}*

📝 **Lore:**
${champion.lore}

💪 **Base Stats:**
❤️ Health: ${champion.stats.hp} (+${champion.stats.hpperlevel}/level)
💙 Resource: ${champion.partype}
⚔️ Attack: ${champion.stats.attackdamage} (+${champion.stats.attackdamageperlevel}/level)
🛡️ Armor: ${champion.stats.armor} (+${champion.stats.armorperlevel}/level)
🏃 Move Speed: ${champion.stats.movespeed}
🎯 Attack Range: ${champion.stats.attackrange}

📊 **Ratings:**
Attack: ${champion.info.attack}/10
Defense: ${champion.info.defense}/10
Magic: ${champion.info.magic}/10
Difficulty: ${champion.info.difficulty}/10

🎯 **Abilities:**
Passive - ${champion.passive.name}:
${champion.passive.description.replace(/<[^>]*>/g, '')}

Q - ${champion.spells[0].name}:
${champion.spells[0].description.replace(/<[^>]*>/g, '')}

W - ${champion.spells[1].name}:
${champion.spells[1].description.replace(/<[^>]*>/g, '')}

E - ${champion.spells[2].name}:
${champion.spells[2].description.replace(/<[^>]*>/g, '')}

R - ${champion.spells[3].name}:
${champion.spells[3].description.replace(/<[^>]*>/g, '')}

🏷️ **Tags:** ${champion.tags.join(', ')}`,
                embeds: [{
                    image: {
                        url: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_0.jpg`
                    }
                }]
            };

            await message.reply(response);

        } catch (err) {
            console.error('Error getting champion data:', err);
            await message.reply('Error getting champion information.');
        }
    }
});

app.get('/', (req, res) => {
    res.send('Discord bot is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

client.login(process.env.DISCORD_TOKEN);