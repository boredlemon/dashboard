function generateRandomString() {
  let randomString = '';
  const randomNumber = Math.floor(Math.random() * 10);

  for (let i = 0; i < 20 + randomNumber; i++) {
    randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
  }

  return randomString;
}

function redirectToDashboard(accessToken) {
  // Function to redirect the user to dashboard.html with the access token
  const dashboardUrl = `dashboard.html#access_token=${accessToken}`;
  window.location.href = dashboardUrl;
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

    document.getElementById('login').href =
      `https://discord.com/oauth2/authorize?client_id=1125530042915631159&redirect_uri=https%3A%2F%2Fdolphinnotfound.github.io%2FDolphinNotBot-dashboard%2F&response_type=token&scope=identify%20guilds&state=${encodeURIComponent(btoa(randomString))}`;
    document.getElementById('login').style.display = 'block';
  } else {
    // If access token is found, fetch user information and redirect to the dashboard
    redirectToDashboard(accessToken);
  }
}

document.getElementById('login').addEventListener('click', fetchUserInfo);
