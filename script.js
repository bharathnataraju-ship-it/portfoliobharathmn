// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Toggle Navigation
        navLinks.classList.toggle('active');
        
        // Hamburger Animation
        hamburger.classList.toggle('toggle');
        if(hamburger.classList.contains('toggle')) {
            hamburger.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // --- Sticky Navbar ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    // --- Typing Animation ---
    const typingText = document.querySelector('.typing-text');
    const textArray = ["Software Developer", "BCA Graduate", "Tech Enthusiast", "Creative Thinker"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = 100;

        if (isDeleting) {
            typingSpeed /= 2; // Delete faster
        }

        if (!isDeleting && charIndex === currentText.length) {
            // Pause at the end
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing animation
    setTimeout(type, 1000);

    // --- Scroll Reveal Animation ---
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');

        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
                
                // If it's a skill card, trigger progress bar animation
                if (reveals[i].classList.contains('skill-card')) {
                    reveals[i].classList.add('visible');
                }
            }
        }
    }

    window.addEventListener('scroll', reveal);
    // Trigger once on load
    reveal();
    
    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Voice Commands (Web Speech API) ---
    const voiceToggle = document.getElementById('voice-toggle');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let isListening = false;

        voiceToggle.addEventListener('click', () => {
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        recognition.onstart = function() {
            isListening = true;
            voiceToggle.classList.add('listening');
            console.log("Voice recognition started. Speak into the microphone.");
        };

        recognition.onspeechend = function() {
            recognition.stop();
        };

        recognition.onend = function() {
            isListening = false;
            voiceToggle.classList.remove('listening');
            console.log("Voice recognition ended.");
        };

        recognition.onerror = function(event) {
            isListening = false;
            voiceToggle.classList.remove('listening');
            console.error('Speech recognition error detected: ' + event.error);
        };

        recognition.onresult = function(event) {
            const command = event.results[0][0].transcript.toLowerCase();
            console.log('Result received: ' + command);

            // Handle Commands
            if (command.includes('home') || command.includes('top')) {
                document.querySelector('a[href="#home"]').click();
            } else if (command.includes('about')) {
                document.querySelector('a[href="#about"]').click();
            } else if (command.includes('skill')) {
                document.querySelector('a[href="#skills"]').click();
            } else if (command.includes('project')) {
                document.querySelector('a[href="#projects"]').click();
            } else if (command.includes('contact')) {
                document.querySelector('a[href="#contact"]').click();
            } else if (command.includes('dark mode')) {
                if (body.classList.contains('light-mode')) {
                    themeToggle.click(); // Switch to dark
                }
            } else if (command.includes('light mode')) {
                if (!body.classList.contains('light-mode')) {
                    themeToggle.click(); // Switch to light
                }
            } else if (command.includes('resume') || command.includes('download')) {
                const resumeBtn = document.querySelector('a[href^="Bharath"]');
                if(resumeBtn) resumeBtn.click();
            } else {
                console.log("Command not recognized.");
            }
        };
    } else {
        voiceToggle.style.display = 'none'; // Hide if not supported
        console.warn("Speech Recognition API is not supported in this browser.");
    }
});
