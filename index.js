const express = require('express');
const { request } = require('undici');
const { clientId, clientSecret, port } = require('./config.json');

const app = express();

app.get('/', async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      const tokenResponse = await request('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `http://localhost:${port}`,
          scope: 'identify',
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const oauthData = await tokenResponse.body.json();

      const userResult = await request('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });

      const userData = await userResult.body.json();

      // Display the user's username and discriminator
      document.getElementById('info').innerText = `Hello, ${userData.username}#${userData.discriminator}!`;
    } catch (error) {
      console.error(error);
    }
  }

  return res.sendFile('index.html', { root: '.' });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
