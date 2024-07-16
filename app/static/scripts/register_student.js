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

    document.getElementById("submit-form").addEventListener("click",(event)=>{
        event.preventDefault();
        register();
    })


    // image sotring variable
    let imageDataUrl = null;

    document.querySelector('#capture').addEventListener('click', function() {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        imageDataUrl = canvasElement.toDataURL('image/png');
        if (imageDataUrl) {
            console.log('Image Captured');
            document.getElementById('imagePreview').src = imageDataUrl;
            document.getElementById('myModal').style.display = "block";
            document.getElementById('video').style.display="none";
            document.getElementById('captured-image').style.display="block";
            document.getElementById('captured-image').src=imageDataUrl;

        } else {
            console.log('Error Capturing Image');
        }
        
        console.log(imageDataUrl);
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


    async function register() {
        const student_first_name = document.getElementById('student_first_name').value || "null";
        const student_last_name = document.getElementById('student_last_name').value;
        const student_email = document.getElementById('student_email').value;  
        const student_phone = document.getElementById('student_phone').value;  
        const student_password = document.getElementById('student_password').value;
        const student_dob = document.getElementById('student_dob').value;
        if (student_first_name && student_last_name && student_dob && student_email && student_phone && student_password && imageDataUrl) {
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
                    "dob":student_dob,
                    "image":imageDataUrl
                })
            });
            const result = await response.json();
            if (result.status === 200) {
                alert("done h bhai")
                // add logic after successfful registration herre
            } else {
                alert('Registration Failed: ' + result.message);
            }
        }else{
            alert('Registration Failed: ' + 'Please enter all the fields and take a picture');
            console.log(`First Name: ${student_first_name}`);
            console.log(`Last Name: ${student_last_name}`);
            console.log(`Email: ${student_email}`);
            console.log(`Phone: ${student_phone}`);
            console.log(`Password: ${student_password}`);
            console.log(`DOB: ${student_dob}`);
        }
        
    }
    

    
});

