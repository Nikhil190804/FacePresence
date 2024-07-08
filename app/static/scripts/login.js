document.getElementById('adminLogin').addEventListener('click', function() {
    login('admin');
});

document.getElementById('customerLogin').addEventListener('click', function() {
    login('student');
});

async function login(role) {
    const username = document.getElementById('username').value;
    const pass = document.getElementById('pass').value;
    
    if (username && pass) {
        console.log(`Logging in as ${role}:`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${pass}`);
        if (role === 'admin') {
            response = await fetch("/login-admin",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",},
                body:JSON.stringify({"username":username,"password":pass})
            });
        } else if (role === 'student') {
            response = await fetch("/login-student",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",},
                body:JSON.stringify({"email":username,"password":pass})
            });
        }
    } else {
        alert('Please enter both username and password.');
    }
}