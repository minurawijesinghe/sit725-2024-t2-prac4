// script.js
const API_URL = 'http://localhost:3000';

// Initialize Materialize components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any Materialize components here if needed
    M.updateTextFields();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load initial data
    getUsers();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Save button click handler
    document.getElementById('saveButton').addEventListener('click', saveUser);
    
    // Refresh button click handler
    document.getElementById('refreshButton').addEventListener('click', getUsers);
    
    // Add event listeners for enter key in input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveUser();
            }
        });
    });
}

// Function to show messages using Materialize toast
function showMessage(message, type) {
    M.toast({
        html: message,
        classes: type,
        displayLength: 3000
    });
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
            // Reset Materialize labels
            M.updateTextFields();
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
        userList.innerHTML = '<h5 class="center-align">Users List</h5>';
        
        if (users.length === 0) {
            userList.innerHTML += `
                <div class="center-align grey-text">
                    <i class="material-icons medium">person_outline</i>
                    <p>No users found</p>
                </div>`;
            return;
        }
        
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.innerHTML = `
                <div class="row valign-wrapper" style="margin-bottom: 0;">
                    <div class="col s2 m1">
                        <i class="material-icons circle blue white-text">person</i>
                    </div>
                    <div class="col s10 m11">
                        <span class="black-text">
                            <strong>${user.name}</strong>
                        </span><br>
                        <span class="user-email">
                            <i class="material-icons tiny">email</i> ${user.email}
                        </span>
                    </div>
                </div>
            `;
            userList.appendChild(userDiv);
        });
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error fetching users', 'error');
    }
}