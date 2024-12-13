const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();

const spotifyApi = new SpotifyWebApi({
    clientId: '5c308255ffe145088f4063c57149cce8',
    clientSecret: '958d49c75e9841ad85c7d2ab8dccb578',
    redirectUri: 'http://localhost:8888/callback'
});

app.get('/login', (req, res) => {
    const scopes = [
        'user-read-currently-playing',
        'user-read-recently-played',
        'user-top-read',
        'playlist-read-private',
        'playlist-read-collaborative'
    ];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        console.log('Refresh token:', data.body['refresh_token']);
        res.send('Success! Check your console for the refresh token.');
    } catch (err) {
        console.error('Error:', err);
        res.send('Error getting token');
    }
});

app.listen(8888, () => {
    console.log('Server is running on http://localhost:8888');
    console.log('Go to http://localhost:8888/login to authorize');
}); 