document.addEventListener('DOMContentLoaded', () => {
    // Match the theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    const orb = document.getElementById('voice-orb');
    const statusText = document.getElementById('status-text');
    const fallbackBtn = document.getElementById('fallback-btn');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        // Keep listening unless they succeed
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            orb.classList.add('listening');
            statusText.innerHTML = 'Say <span>"Open Portfolio"</span> to enter';
        };

        recognition.onresult = function(event) {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript.toLowerCase();
            
            console.log("Heard:", transcript);
            
            if (transcript.includes('open') || transcript.includes('enter') || transcript.includes('portfolio') || transcript.includes('go')) {
                orb.classList.remove('listening');
                orb.classList.add('success');
                statusText.innerHTML = 'Access <span>Granted</span>. Redirecting...';
                
                // Play a tiny delay then redirect
                setTimeout(() => {
                    window.location.href = 'portfolio.html';
                }, 1500);
                
                recognition.stop();
            } else {
                statusText.innerHTML = 'Command not recognized. Try saying <span>"Open Portfolio"</span>';
            }
        };

        recognition.onerror = function(event) {
            console.error("Speech Recognition Error:", event.error);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                statusText.innerHTML = 'Microphone access denied. Please enter manually.';
                orb.classList.remove('listening');
            } else if (event.error === 'no-speech') {
                // Ignore, will restart
            } else {
                statusText.innerHTML = 'Error: ' + event.error + '. Click the orb to try again.';
                orb.classList.remove('listening');
            }
        };

        recognition.onend = function() {
            // If they haven't succeeded and it wasn't an explicit error stop, restart
            if (!orb.classList.contains('success') && orb.classList.contains('listening')) {
                try { recognition.start(); } catch(e){}
            }
        };

        // Some browsers require a user interaction before starting mic. We try to start it immediately.
        try {
            recognition.start();
        } catch(e) {
            statusText.innerHTML = 'Click the microphone to activate Voice Assistant';
            orb.classList.remove('listening');
        }

        // Allow clicking the orb to force start listening if it failed or stopped
        orb.addEventListener('click', () => {
            if (!orb.classList.contains('listening') && !orb.classList.contains('success')) {
                statusText.innerHTML = 'Starting...';
                try { recognition.start(); } catch(e){}
            }
        });

    } else {
        // Speech API not supported
        statusText.innerHTML = 'Voice Assistant not supported on this browser. Please enter manually.';
    }
});
