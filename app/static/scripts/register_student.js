document.addEventListener('DOMContentLoaded', function() {
    // Acess demand variables
    const constraints = {
        video: true, 
        audio: false 
    };

    const videoElement = document.getElementById('video');
    const captureButton = document.getElementById('capture');
    const canvasElement = document.getElementById('canvasElement');
    const context = canvasElement.getContext('2d');

    
    
    
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
        videoElement.srcObject = stream;
        videoElement.style.display = 'block'; 
        videoElement.play(); 
    })
    .catch(function(err) {
        console.error('Error accessing the camera: ', err);
    });


    let imageDataUrl = null;
    // image sotring variable
    let capturedImageBlob = null;

    document.querySelector('#capture').addEventListener('click', function() {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        canvasElement.toBlob(function(blob) {
            // image stored as blob in this variable
            capturedImageBlob = blob;
            var imageDataUrl = URL.createObjectURL(blob);
            if (imageDataUrl) {
                console.log('Image Captured');
                document.getElementById('imagePreview').src = imageDataUrl;
                document.getElementById('myModal').style.display = "block";
            } else {
                console.log('Error Capturing Image');
            }
        }, 'image/png');
    });
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        document.getElementById('myModal').style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == document.getElementById('myModal')) {
            document.getElementById('myModal').style.display = "none";
        }
    }

    
    document.querySelector('#save').addEventListener('click', function() {
        console.log('Image blob is reaady', capturedImageBlob);
    });


    async function login(role) {
        const student_first_name = document.getElementById('student_first_name').value;
        const student_last_name = document.getElementById('student_last_name').value;
        const student_email = document.getElementById('student_email').value;  
        const student_phone = document.getElementById('student_phone').value;  
        const student_password = document.getElementById('student_password').value;
        const student_dob = document.getElementById('student_dob').value;
        if (student_first_name && student_last_name && student_dob && student_email && student_phone && student_password && capturedImageBlob) {
            console.log(`Registering as ${role}:`);
            console.log(`First Name: ${student_first_name}`);
            console.log(`Last Name: ${student_last_name}`);
            console.log(`Email: ${student_email}`);
            console.log(`Phone: ${student_phone}`);
            console.log(`Password: ${student_password}`);
            console.log(`DOB: ${student_dob}`);
            response = await fetch("/student-register",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",},
                body:JSON.stringify({
                    "first_name":student_first_name,
                    "last_name":student_last_name,
                    "email":student_email,
                    "phone":student_phone,
                    "password":student_password,
                    "dob":student_dob
                    // add image sending logic here
                    
                })
            });
            const result = await response.json();
            if (result.status === 200) {
                // add logic after successfful registration herre
            } else {
                alert('Registration Failed: ' + result.message);
            }
        }else{
            alert('Registration Failed: ' + 'Please enter all the fields and take a picture');
        }
        
    }
    

    
});

