const video = document.getElementById('video');
const capturedPhoto = document.getElementById('captured-photo');
const captureButton = document.getElementById('capture-button');
let image=null;
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        alert("Camera Access needed for this operation!!!!!")
        console.error('Error accessing the camera', error);
    });

captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width,canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');
    capturedPhoto.src = imageDataUrl;
    capturedPhoto.style.display = 'block';
    image=imageDataUrl;
});

const attendancebtn = document.getElementById("attendance-button");
attendancebtn.addEventListener("click",async ()=>{
    if(image===null){
        alert("Image Not Captured!!!!!");
    }
    else{
        response = await fetch("/give-attendance",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",},
            body:JSON.stringify({
                "image":image
            })
        });
        const result = await response.json();
        if (result.status === 200) {
            alert("SUCCESS SHOW DATA HERE")
                // show the student data
        } else {
            alert('Attendance Failed: ');
        }


    }
    
})