document.getElementById('adminLogin').addEventListener('click', function() {
    login('admin');
});

document.getElementById('customerLogin').addEventListener('click', function() {
    login('student');
});

function login(role) {
    const username = document.getElementById('username').value;
    const pass = document.getElementById('pass').value;
    
    if (username && pass) {
        console.log(`Logging in as ${role}:`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${pass}`);
        
        // Send login information to Flask backend
        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: pass,
                role: role
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Login successful');
            // Redirect based on role
            if (role === 'admin') {
                window.location.href = '/admin';
            } else if (role === 'student') {
                window.location.href = '/student';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
        
    } else {
        alert('Please enter both username and password.');
    }
}