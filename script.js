// Function to fetch user data from the server
async function fetchUserData() {
    try {
      const response = await fetch('/api/user/12345'); // Replace '12345' with the user's Discord ID
      const userData = await response.json();
  
      // Update the user profile with fetched data
      document.getElementById('username').textContent = userData.username;
      document.getElementById('favoriteColor').textContent = userData.favoriteColor;
      document.getElementById('hobbies').textContent = userData.hobbies;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  
  // Event listener for the login button
  document.getElementById('login').addEventListener('click', () => {
    // Implement Discord OAuth login here
    alert('Login with Discord!');
  });
  
  // Fetch user data when the page loads
  document.addEventListener('DOMContentLoaded', fetchUserData);
  