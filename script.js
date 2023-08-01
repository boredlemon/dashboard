function generateRandomString() {
  let randomString = '';
  const randomNumber = Math.floor(Math.random() * 10);

  for (let i = 0; i < 20 + randomNumber; i++) {
    randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
  }

  return randomString;
}

window.onload = () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const [accessToken, tokenType, state] = [
    fragment.get('access_token'),
    fragment.get('token_type'),
    fragment.get('state'),
  ];

  if (!accessToken) {
    const randomString = generateRandomString();
    localStorage.setItem('oauth-state', randomString);
    document.getElementById('login').href =
      'https://discord.com/oauth2/authorize?client_id=1125530042915631159&redirect_uri=https%3A%2F%2Fdolphinnotfound.github.io%2FDolphinNotBot-dashboard%2F&response_type=token&scope=identify'; // Add scope=identify
    document.getElementById('login').style.display = 'block';
  } else {
    // Check state parameter to prevent CSRF attacks
    if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
      console.log('You may have been clickjacked!');
      return;
    }

    fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${tokenType} ${accessToken}`, // Fix the Authorization header
      },
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error(`${result.status}: ${result.statusText}`);
        }
        return result.json();
      })
      .then((response) => {
        console.log(response); // Add this line to check the API response.
        const { username, discriminator, avatar } = response;
        document.getElementById('info').innerText += ` ${username}#${discriminator}`;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${response.id}/${avatar}.png`;
        document.getElementById('username').innerText = `${username}#${discriminator}`;
      })
      .catch((error) => console.error('API Error:', error));
  }
};
