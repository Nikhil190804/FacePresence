document.getElementById('adminLogin').addEventListener('click', function() {
    login('admin');
});

document.getElementById('customerLogin').addEventListener('click', function() {
    login('customer');
});

function login(role) {
    const username = document.getElementById('username').value;
    const pass = document.getElementById('pass').value;
    
    if (username && pass) {
        console.log(`Logging in as ${role}:`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${pass}`);
        if (role === 'admin') {
            window.location.href = 'admin_dashboard.html';
        } else if (role === 'customer') {
            window.location.href = 'customer_dashboard.html'; 
        }
    } else {
        alert('Please enter both username and password.');
    }
}
