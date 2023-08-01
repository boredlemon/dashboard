function generateRandomString() {
  let randomString = '';
  const randomNumber = Math.floor(Math.random() * 10);

  for (let i = 0; i < 20 + randomNumber; i++) {
    randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
  }

  return randomString;
}

function fetchUserInfo() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const [accessToken, tokenType, state] = [
    fragment.get('access_token'),
    fragment.get('token_type'),
    fragment.get('state'),
  ];

  if (!accessToken) {
    const randomString = generateRandomString();
    localStorage.setItem('oauth-state', randomString);

    document.getElementById('login').href += `&state=${encodeURIComponent(btoa(randomString))}`;
    return (document.getElementById('login').style.display = 'block');
  }

  if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
    return console.log('You may have been click-jacked!');
  }

  fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    },
  })
    .then((result) => {
      if (!result.ok) {
        throw new Error(`${result.status}: ${result.statusText}`);
      }
      return result.json();
    })
    .then((response) => {
      const { username, discriminator, avatar } = response;
      document.getElementById('info').innerText += ` ${username}#${discriminator}`;
      document.getElementById('user-info').style.display = 'block';
      document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${response.id}/${avatar}.png`;
      document.getElementById('username').innerText = `${username}#${discriminator}`;

      // Fetch user's servers using the guilds scope
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
        },
      })
        .then((result) => result.json())
        .then((servers) => {
          // Display the list of servers
          const serverList = document.getElementById('server-list');
          servers.forEach((server) => {
            const serverElement = document.createElement('div');
            const serverIcon = document.createElement('img');
            const serverName = document.createElement('p');
            serverIcon.src = `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`;
            serverIcon.alt = `Server Icon - ${server.name}`;
            serverName.textContent = server.name;
            serverElement.appendChild(serverIcon);
            serverElement.appendChild(serverName);
            serverList.appendChild(serverElement);
          });
        })
        .catch((error) => console.error('Error fetching servers:', error));
    })
    .catch((error) => console.error('API Error:', error));
}

document.getElementById('login').addEventListener('click', fetchUserInfo);