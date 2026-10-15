document.addEventListener("DOMContentLoaded", () => {

    let randomNumber = Math.floor(Math.random() * 99) + 1;
    let attempts = 0; 
    const MAX_ATTEMPTS = 15;

    const myButton = document.getElementById('button');
    const myInput = document.getElementById('input');

    const customAlert = document.getElementById('customAlert');
    const closeBtn = document.getElementById('closeBtn');
    const alertMessage = document.getElementById('alertMessage');
    const timerSlider = document.getElementById('timerSlider');

    const cursorContainer = document.querySelector('.custom-cursor');
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorOuter = document.querySelector('.cursor-outer');

    let animationFrameId;
    const DISPLAY_DURATION_MS = 4000; 

    function applyAlertTheme(type) {
        if (!customAlert || !timerSlider || !alertMessage || !closeBtn) return;

        alertMessage.style.color = '#1a1a1a';
        closeBtn.style.color = '#888';

        let boxColor = '#4ADE80'; 
        let sliderColor = '#22c55e';
        let darkCursorColor = '#16a34a'; 

        if (type === 'success') {
            boxColor = '#4ADE80';         
            sliderColor = '#22c55e';
            darkCursorColor = '#16a34a'; 
        } else if (type === 'hint') {
            boxColor = '#FACC15';         
            sliderColor = '#eab308';
            darkCursorColor = '#ca8a04'; 
        } else if (type === 'error') {
            boxColor = '#F87171';         
            sliderColor = '#ef4444';
            darkCursorColor = '#dc2626'; 
        }

        customAlert.style.backgroundColor = boxColor;
        timerSlider.style.backgroundColor = sliderColor;

        if (cursorInner) cursorInner.style.backgroundColor = darkCursorColor;
        if (cursorOuter) cursorOuter.style.backgroundColor = `${darkCursorColor}44`; 
    }

    function resetCursorTheme() {
        if (cursorInner) cursorInner.style.backgroundColor = 'rgb(0, 150, 255)';
        if (cursorOuter) cursorOuter.style.backgroundColor = 'rgba(0, 150, 255, 0.2)';
    }

    function triggerCardAlert(message, type = 'hint') {
        if (!alertMessage || !customAlert || !timerSlider) return;

        applyAlertTheme(type);
        alertMessage.textContent = message;

        cancelAnimationFrame(animationFrameId);
        
        customAlert.classList.add('no-transition');
        customAlert.classList.remove('state-hidden-bottom');
        customAlert.classList.add('state-hidden-top');
        
        customAlert.getBoundingClientRect(); 

        customAlert.classList.remove('no-transition');
        customAlert.classList.remove('state-hidden-top');

        const startTime = performance.now();
        
        function updateSlider(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progressLeft = Math.max(0, 1 - (elapsedTime / DISPLAY_DURATION_MS));
            
            timerSlider.style.transform = `scaleX(${progressLeft})`;

            if (elapsedTime < DISPLAY_DURATION_MS) {
                animationFrameId = requestAnimationFrame(updateSlider);
            } else {
                slideOutToBottom();
            }
        }
        
        animationFrameId = requestAnimationFrame(updateSlider);
    }

    function slideOutToBottom() {
        cancelAnimationFrame(animationFrameId);
        if (customAlert) customAlert.classList.add('state-hidden-bottom');
        resetCursorTheme();
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', slideOutToBottom);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (customAlert && 
                !customAlert.classList.contains('state-hidden-top') && 
                !customAlert.classList.contains('state-hidden-bottom')) {
                
                e.preventDefault();
                slideOutToBottom();
            }
        }
    });

    if (myButton) {
        myButton.addEventListener('click', function() {
            if (myButton.textContent === "Play Again") {
                randomNumber = Math.floor(Math.random() * 99) + 1;
                attempts = 0;
                myInput.value = "";
                myInput.disabled = false;
                myButton.textContent = "Submit Guess";
                myButton.style.backgroundColor = "";
                slideOutToBottom();
                return;
            }

            const inputValue = Number(myInput.value);
            
            if (myInput.value.trim() === "" || Number.isNaN(inputValue)) {
                triggerCardAlert('Please type a number', 'error');
                return;
            }

            if (attempts >= MAX_ATTEMPTS) {
                triggerCardAlert(`Game Over! You have run out of turns (${MAX_ATTEMPTS}/${MAX_ATTEMPTS}).`, 'error');
                myButton.textContent = "Play Again";
                myButton.style.backgroundColor = "#3B82F6";
                myInput.disabled = true;
                return;
            }

            attempts++; 

            if (inputValue === randomNumber) { 
                triggerCardAlert(`You got the number! It took you ${attempts} tries.`, 'success'); 
                myButton.textContent = "Play Again";
                myButton.style.backgroundColor = "#3B82F6";
                myInput.disabled = true;
            } else if (attempts >= MAX_ATTEMPTS) {
                triggerCardAlert(`Game Over! You have run out of turns (${attempts}/${MAX_ATTEMPTS}).`, 'error');
                myButton.textContent = "Play Again";
                myButton.style.backgroundColor = "#3B82F6";
                myInput.disabled = true;
            } else if (inputValue > randomNumber) { 
                triggerCardAlert(`Number is too big (${attempts}/${MAX_ATTEMPTS} tries)`, 'hint'); 
            } else if (inputValue < randomNumber) { 
                triggerCardAlert(`Number is too small (${attempts}/${MAX_ATTEMPTS} tries)`, 'hint'); 
            }
        });
    }

    window.addEventListener('mousemove', (e) => {
      if (cursorContainer) {
          cursorContainer.style.left = `${e.clientX}px`;
          cursorContainer.style.top = `${e.clientY}px`;
      }
    });

    window.addEventListener('mousedown', () => {
      if (cursorContainer) cursorContainer.classList.add('is-clicked');
    });

    window.addEventListener('mouseup', () => {
      if (cursorContainer) cursorContainer.classList.remove('is-clicked');
    });

});
