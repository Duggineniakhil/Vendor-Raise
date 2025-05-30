// Mobile Navigation
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.querySelector('i').classList.toggle('fa-times');
    });
}

// Tab Switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.auth-form');

if (tabBtns.length > 0 && tabContents.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
}

// Testimonial Slider
const testimonials = document.querySelectorAll('.testimonial');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    testimonials[index].classList.add('active');
}

if (testimonials.length > 1) {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Form Validation for Contact Page
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Store contact form data
        const contactData = {
            name,
            email,
            subject,
            message,
            date: new Date().toISOString()
        };
        
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.push(contactData);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize dashboard if on dashboard page
if (document.querySelector('.dashboard')) {
    initializeDashboard();
}

function initializeDashboard() {
    // Load user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        if (currentUser.type === 'vendor') {
            document.getElementById('vendor-name').textContent = currentUser.businessName || 'Vendor';
            loadVendorData(currentUser);
        } else if (currentUser.type === 'lender') {
            document.getElementById('lender-name').textContent = currentUser.name || 'Lender';
            loadLenderData(currentUser);
        }
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // Initialize chat
    initChat();
}

function initChat() {
    const chatBtn = document.getElementById('chat-btn');
    const chatPopup = document.getElementById('chat-popup');
    const closeChat = document.getElementById('close-chat');
    
    if (chatBtn && chatPopup && closeChat) {
        chatBtn.addEventListener('click', () => {
            chatPopup.classList.toggle('active');
        });
        
        closeChat.addEventListener('click', () => {
            chatPopup.classList.remove('active');
        });
        
        // Send message functionality
        const sendBtn = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');
        
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {
            const messageText = chatInput.value.trim();
            if (messageText) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', 'sent');
                messageDiv.textContent = messageText;
                chatMessages.appendChild(messageDiv);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate reply after 1 second
                setTimeout(() => {
                    const replyDiv = document.createElement('div');
                    replyDiv.classList.add('message', 'received');
                    replyDiv.textContent = 'Thanks for your message! Our team will get back to you soon.';
                    chatMessages.appendChild(replyDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        }
        
        // Load any existing messages
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const welcomeDiv = document.createElement('div');
            welcomeDiv.classList.add('message', 'received');
            welcomeDiv.textContent = `Hello ${currentUser.name || currentUser.businessName || 'there'}! How can we help you today?`;
            chatMessages.appendChild(welcomeDiv);
        }
    }
}