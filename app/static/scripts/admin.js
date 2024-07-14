document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.new-reg-button').addEventListener('click', function() {
        new_reg();
    });

    document.querySelector('.attendence-record').addEventListener('click', function() {
        // Action for viewing attendance record
    });
});

async function new_reg() {
    window.location.href = '/register-student';
}





