//!<(---- VARIABLES ----)>
const eye = document.querySelector('.eye');
const pupil = document.querySelector('.pupil');
const bloodVeins = document.querySelector('.blood-veins');

//!<(---- MAGIC EYE ----)>
document.addEventListener('mousemove', (event) => {
    // Get the mouse position relative to the eye container
    const eyeRect = eye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate the distance between the eye center and the mouse
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;

    // Set maximum range of pupil and eye rotation to prevent excessive movement
    const maxRotation = 12;  // More dramatic rotation
    const maxPupilMovement = 10;  // Larger pupil movement for more unsettling effect

    // Calculate the angle between the center of the eye and the mouse
    const angleX = Math.min(Math.max((deltaY / eyeRect.height) * maxRotation, -maxRotation), maxRotation);
    const angleY = Math.min(Math.max(-(deltaX / eyeRect.width) * maxRotation, -maxRotation), maxRotation);

    // Update the eye's rotation
    eye.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;

    // Move the pupil within a limited range
    const pupilX = Math.min(Math.max((deltaX / eyeRect.width) * maxPupilMovement, -maxPupilMovement), maxPupilMovement);
    const pupilY = Math.min(Math.max((deltaY / eyeRect.height) * maxPupilMovement, -maxPupilMovement), maxPupilMovement);
    pupil.style.transform = `translate(-50%, -50%) translate(${pupilX}px, ${pupilY}px)`;

    // Bloodshot veins effect (flickering random animation for extra scare)
    if (Math.random() < 0.05) {
        bloodVeins.style.animationDuration = `${Math.random() * 2 + 1}s`;
    }
});