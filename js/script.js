document.addEventListener('DOMContentLoaded', () => {
    // Get the mobile menu elements
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    // Get the registration form and message box (only relevant on registration.html)
    const registrationForm = document.getElementById('registration-form');
    const formMessage = document.getElementById('form-message');

    // Get elements for the LLM features (from courses.html and programs.html)
    const generateSyllabusButtons = document.querySelectorAll('.generate-syllabus-btn');
    const workshopTopicInput = document.getElementById('workshop-topic-input');
    const generateWorkshopBtn = document.getElementById('generate-workshop-btn');
    const workshopOutput = document.getElementById('workshop-output');

    // Chatbot elements (assuming these elements are present in your HTML files)
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotModal = document.getElementById('chatbot-modal');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');

    // --- Dynamic Homepage Background Images ---
    const heroSection = document.getElementById('hero-section');
    // These are the Cloudinary URLs provided by the user
    const heroBackgroundImages = [
        'https://res.cloudinary.com/dujxs5154/image/upload/v1751132803/sk%20robotics/sample3_tjqauq.jpg',
        'https://res.cloudinary.com/dujxs5154/image/upload/v1751132802/sk%20robotics/sample5_qsl3lj.jpg',
        'https://res.cloudinary.com/dujxs5154/image/upload/v1751132802/sk%20robotics/sample1_ecjfcp.jpg',
        'https://res.cloudinary.com/dujxs5154/image/upload/v1751132802/sk%20robotics/sample4_a0doy6.jpg',
        'https://res.cloudinary.com/dujxs5154/image/upload/v1751132802/sk%20robotics/sample2_iknqkk.jpg'
    ];
    let currentImageIndex = 0;

    /**
     * Preloads an array of image URLs to prevent flickering.
     * @param {string[]} imageUrls - An array of image URLs to preload.
     */
    const preloadImages = (imageUrls) => {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    };

    function changeHeroBackground() {
        if (heroSection) {
            currentImageIndex = (currentImageIndex + 1) % heroBackgroundImages.length;
            heroSection.style.backgroundImage = `url('${heroBackgroundImages[currentImageIndex]}')`;
        }
    }

    // Preload all background images on page load
    preloadImages(heroBackgroundImages);

    // Change background every 5 seconds
    if (heroSection) {
        // Set initial background after preloading
        heroSection.style.backgroundImage = `url('${heroBackgroundImages[currentImageIndex]}')`;
        setInterval(changeHeroBackground, 5000); // Change image every 5 seconds
    }


    // --- Animation and Interaction Enhancements ---

    // Function to add a class for fade-in effect on scroll
    const animateOnScroll = () => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up'); // Custom class for animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Offset the trigger point
        });

        // Select elements with 'animate-on-scroll' class
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    };

    // Initialize animations on page load
    animateOnScroll();

    // Toggle mobile menu visibility
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when a link is clicked (for smoother navigation on mobile)
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Set active class on current page's navigation link
    const currentPath = window.location.pathname.split('/').pop(); // Get the current filename (e.g., 'index.html', 'courses.html')
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        // Handle index.html being both 'index.html' and possibly an empty string if accessed as root
        if (currentPath === linkPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    /**
     * Displays a message to the user (success or error) for the registration form.
     * This function is only called on the registration.html page.
     * @param {string} message - The message to display.
     * @param {boolean} isSuccess - True for success, false for error.
     */
    const displayMessage = (message, isSuccess) => {
        if (formMessage) { // Ensure formMessage element exists before trying to use it
            formMessage.textContent = message;
            formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
            if (isSuccess) {
                formMessage.classList.add('bg-green-100', 'text-green-800');
            } else {
                formMessage.classList.add('bg-red-100', 'text-red-800');
            }
            formMessage.classList.remove('hidden');

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        }
    };

    // Handle form submission (only if on the registration.html page)
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (event) => { // Made async to use await with fetch
            event.preventDefault(); // Prevent default form submission

            // Client-side validation
            const parentName = document.getElementById('parent-name').value.trim();
            const studentName = document.getElementById('student-name').value.trim();
            const studentAge = document.getElementById('student-age').value.trim();
            const phoneNumber = document.getElementById('phone-number').value.trim();
            const emailAddress = document.getElementById('email-address').value.trim();
            const courseProgram = document.getElementById('course-program').value;

            if (!parentName || !studentName || !studentAge || !phoneNumber || !emailAddress || !courseProgram) {
                displayMessage('Please fill in all required fields.', false);
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailAddress)) {
                displayMessage('Please enter a valid email address.', false);
                return;
            }

            const phoneRegex = /^[0-9]{10}$/; // Assumes 10-digit Indian phone number
            if (!phoneRegex.test(phoneNumber)) {
                displayMessage('Please enter a valid 10-digit phone number.', false);
                return;
            }

            // Set the _replyto hidden field before submission
            document.getElementById('form-reply-to-email').value = emailAddress;

            // Use fetch to submit the form data to Formspree
            const formData = new FormData(registrationForm);

            try {
                const response = await fetch(registrationForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree AJAX
                    }
                });

                if (response.ok) {
                    displayMessage('Thank you for registering! We will contact you within 24 hours.', true);
                    registrationForm.reset();
                } else {
                    const errorData = await response.json();
                    console.error('Formspree error:', errorData);
                    displayMessage('Registration failed. Please try again later.', false);
                }
            } catch (error) {
                console.error('Network or submission error:', error);
                displayMessage('An error occurred during submission. Please check your internet connection and try again.', false);
            }
        });
    }

    // --- Gemini API Integrations ---

    /**
     * Calls the Gemini API to generate text.
     * @param {string} prompt - The prompt to send to the LLM.
     * @returns {Promise<string>} - The generated text.
     */
    async function callGeminiAPI(prompt) {
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = ""; // Canvas will automatically provide the API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                console.error("Gemini API returned an unexpected structure:", result);
                return "Error: Could not generate content.";
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            return "Error: Failed to connect to AI service.";
        }
    }

    // Feature 1: Generate Syllabus Idea on Courses Page
    // Check if generateSyllabusButtons exist (only on courses.html)
    if (generateSyllabusButtons.length > 0) {
        generateSyllabusButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const courseTitle = event.target.dataset.courseTitle;
                const outputDiv = event.target.nextElementSibling; // The div right after the button

                if (outputDiv) {
                    outputDiv.classList.remove('hidden');
                    outputDiv.innerHTML = '<p class="text-center text-purple-700">Generating syllabus...</p>';
                }

                const prompt = `Generate a detailed syllabus idea for a robotics course titled "${courseTitle}" for school students. Include module names, key topics, and a brief description for each module. Structure it as a clear, easy-to-read list or bullet points.`;

                const generatedSyllabus = await callGeminiAPI(prompt);

                if (outputDiv) {
                    // Ensure marked is loaded before parsing
                    if (typeof marked !== 'undefined') {
                         outputDiv.innerHTML = `<h4 class="font-semibold text-purple-800 mb-2">Suggested Syllabus for ${courseTitle}:</h4><div class="prose prose-sm">${marked.parse(generatedSyllabus)}</div>`;
                    } else {
                        // Fallback to pre-formatted text if marked.js is not loaded
                        outputDiv.innerHTML = `<h4 class="font-semibold text-purple-800 mb-2">Suggested Syllabus for ${courseTitle}:</h4><pre class="whitespace-pre-wrap">${generatedSyllabus}</pre>`;
                    }
                }
            });
        });
    }


    // Feature 2: Generate Workshop Ideas on Programs Page
    if (generateWorkshopBtn && workshopTopicInput && workshopOutput) {
        generateWorkshopBtn.addEventListener('click', async () => {
            const topic = workshopTopicInput.value.trim();

            if (!topic) {
                workshopOutput.classList.remove('hidden');
                workshopOutput.innerHTML = '<p class="text-red-600">Please enter a workshop topic.</p>';
                return;
            }

            workshopOutput.classList.remove('hidden');
            workshopOutput.innerHTML = '<p class="text-center text-purple-700">Generating workshop ideas...</p>';

            const prompt = `Generate 3-5 creative and engaging workshop ideas for school students based on the topic "${topic}" related to robotics and technology. For each idea, provide a catchy name and a brief, exciting description. Format as a numbered list.`;

            const generatedIdeas = await callGeminiAPI(prompt);

            if (workshopOutput) {
                // Ensure marked is loaded before parsing
                if (typeof marked !== 'undefined') {
                    workshopOutput.innerHTML = `<h4 class="font-semibold text-purple-800 mb-2">Workshop Ideas for "${topic}":</h4><div class="prose prose-sm">${marked.parse(generatedIdeas)}</div>`;
                } else {
                    // Fallback to pre-formatted text if marked.js is not loaded
                    workshopOutput.innerHTML = `<h4 class="font-semibold text-purple-800 mb-2">Workshop Ideas for "${topic}":</h4><pre class="whitespace-pre-wrap">${generatedIdeas}</pre>`;
                }
            }
        });
    }

    // --- Chatbot Integration ---

    // Chat history for the chatbot
    let chatbotChatHistory = [{
        role: "model",
        parts: [{ text: "Hello! I'm your SK Robotics AI assistant. How can I help you today?" }]
    }];

    /**
     * Appends a message to the chatbot display.
     * @param {string} sender - 'user' or 'model'.
     * @param {string} message - The message text.
     */
    const appendChatMessage = (sender, message) => {
        if (!chatMessagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.classList.add('p-3', 'rounded-lg', 'max-w-[75%]', 'mb-2', 'break-words');

        if (sender === 'user') {
            messageElement.classList.add('bg-indigo-500', 'text-white', 'ml-auto', 'rounded-br-none');
        } else {
            messageElement.classList.add('bg-gray-200', 'text-gray-800', 'rounded-bl-none');
        }

        // If it's a model message and marked is available, parse markdown
        if (sender === 'model' && typeof marked !== 'undefined') {
            messageElement.innerHTML = marked.parse(message);
            messageElement.classList.add('prose', 'prose-sm'); // Add prose classes for styling
        } else {
            messageElement.textContent = message;
        }

        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to bottom
    };

    /**
     * Initializes the chatbot display with initial messages.
     */
    const initializeChatbotDisplay = () => {
        if (!chatMessagesContainer) return;
        chatMessagesContainer.innerHTML = ''; // Clear previous messages
        chatbotChatHistory.forEach(msg => {
            appendChatMessage(msg.role, msg.parts[0].text);
        });
    };

    // Open chatbot modal
    if (chatbotToggleBtn && chatbotModal) {
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotModal.classList.remove('hidden');
            // Add animation class to modal for opening effect
            chatbotModal.querySelector('.bg-white').classList.add('animate-scale-in');
            initializeChatbotDisplay(); // Load initial messages or history
        });
    }

    // Close chatbot modal
    if (chatbotCloseBtn && chatbotModal) {
        chatbotCloseBtn.addEventListener('click', () => {
            // Add animation class for closing effect
            chatbotModal.querySelector('.bg-white').classList.remove('animate-scale-in');
            chatbotModal.querySelector('.bg-white').classList.add('animate-scale-out');
            setTimeout(() => {
                chatbotModal.classList.add('hidden');
                chatbotModal.querySelector('.bg-white').classList.remove('animate-scale-out'); // Clean up animation class
            }, 300); // Match CSS animation duration
        });
    }

    // Send message via chatbot input
    if (chatSendBtn && chatInput && chatMessagesContainer) {
        chatSendBtn.addEventListener('click', async () => {
            const userMessage = chatInput.value.trim();
            if (userMessage === '') return;

            appendChatMessage('user', userMessage);
            chatbotChatHistory.push({ role: "user", parts: [{ text: userMessage }] });
            chatInput.value = ''; // Clear input

            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('p-3', 'rounded-lg', 'bg-gray-200', 'text-gray-600', 'mb-2', 'typing-indicator');
            typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
            chatMessagesContainer.appendChild(typingIndicator);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

            try {
                // Call Gemini API for chatbot response (using gemini-2.0-flash for chat)
                const payload = { contents: chatbotChatHistory };
                const apiKey = ""; // Canvas will automatically provide the API key
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();

                // Remove typing indicator
                if (chatMessagesContainer.contains(typingIndicator)) {
                    chatMessagesContainer.removeChild(typingIndicator);
                }

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const modelResponse = result.candidates[0].content.parts[0].text;
                    appendChatMessage('model', modelResponse); // appendChatMessage now handles markdown
                    chatbotChatHistory.push({ role: "model", parts: [{ text: modelResponse }] });
                } else {
                    console.error("Gemini API returned an unexpected structure for chatbot:", result);
                    appendChatMessage('model', "Sorry, I couldn't generate a response. Please try again.");
                }
            } catch (error) {
                console.error("Error calling Gemini API for chatbot:", error);
                // Remove typing indicator
                if (chatMessagesContainer.contains(typingIndicator)) {
                    chatMessagesContainer.removeChild(typingIndicator);
                }
                appendChatMessage('model', "Apologies, I'm having trouble connecting right now. Please try again later.");
            }
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to bottom after new message
        });

        // Allow sending message with Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent new line in input
                chatSendBtn.click();
            }
        });
    }
});
