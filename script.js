function generateRandomString() {
  let randomString = '';
  const randomNumber = Math.floor(Math.random() * 10);

  for (let i = 0; i < 20 + randomNumber; i++) {
    randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
  }

  return randomString;
}

function displayUserInfo(response) {
  const { username, discriminator, avatar } = response;
  document.getElementById('user-info').style.display = 'block';
  document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${response.id}/${avatar}.png`;
  document.getElementById('username').innerText = `${username}#${discriminator}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = fragment.get('access_token');

  if (!accessToken) {
    const randomString = generateRandomString();
    localStorage.setItem('oauth-state', randomString);
    document.getElementById('login').href =
      'https://discord.com/oauth2/authorize?client_id=1125530042915631159&redirect_uri=https%3A%2F%2Fdolphinnotfound.github.io%2FDolphinNotBot-dashboard%2F&response_type=token&scope=identify';
    document.getElementById('login').style.display = 'block';
  } else {
    const state = localStorage.getItem('oauth-state');
    const decodedState = atob(decodeURIComponent(fragment.get('state')));

    if (state !== decodedState) {
      console.log('You may have been clickjacked!');
      return;
    }

    fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error(`${result.status}: ${result.statusText}`);
        }
        return result.json();
      })
      .then((response) => {
        console.log(response);
        displayUserInfo(response);
      })
      .catch((error) => console.error('API Error:', error));
  }
});
