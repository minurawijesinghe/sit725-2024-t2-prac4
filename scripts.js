// script.js
// Backend API URL
const API_URL = 'http://localhost:3000';

// Function to display messages (error or success)
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = type;
    
    // Remove previous messages
    const previousMessages = document.querySelectorAll('.error, .success');
    previousMessages.forEach(msg => msg.remove());
    
    document.querySelector('.container').appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => messageDiv.remove(), 3000);
}

// Function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Function to save user
async function saveUser() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Validation
    if (!name || !email) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
            showMessage('User saved successfully', 'success');
            nameInput.value = '';
            emailInput.value = '';
            getUsers(); // Refresh the list
        } else {
            const error = await response.json();
            showMessage(error.message || 'Error saving user', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error connecting to server', 'error');
    }
}

// Function to get users
async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        
        const userList = document.getElementById('userList');
        userList.innerHTML = '<h2>Users</h2>';
        
        if (users.length === 0) {
            userList.innerHTML += '<p>No users found</p>';
            return;
        }
        
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.innerHTML = `
                <strong>Name:</strong> ${user.name}<br>
                <strong>Email:</strong> ${user.email}
            `;
            userList.appendChild(userDiv);
        });
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error fetching users', 'error');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    getUsers();
    
    // Add event listeners for enter key in input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveUser();
            }
        });
    });
});