// Navbar scroll effect
window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Active link highlighting
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.parentElement.classList.add('active');
            }
        });
    });
});
// Back to Top button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("back-to-top").style.display = "block";
    } else {
        document.getElementById("back-to-top").style.display = "none";
    }
}

document.getElementById("back-to-top").onclick = function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modals
    var modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        new bootstrap.Modal(modal);
    });

    // Smooth scroll for "Contact Us" links in modals
    var contactLinks = document.querySelectorAll('.modal-footer a[href="#contact"]');
    contactLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var contactSection = document.querySelector('#contact');
            contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Handle "Proceed to Payment" button clicks
    var paymentButtons = document.querySelectorAll('.modal-body .btn-primary');
    paymentButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Here you would typically integrate with a payment gateway
            // For this example, we'll just show an alert
            alert('Redirecting to payment gateway...');
            
            // Close the modal
            var modal = button.closest('.modal');
            var bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();
        });
    });

    // Handle modal close button
    var closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var modal = button.closest('.modal');
            var bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get all rate cards
    const rateCards = document.querySelectorAll('.rate-card');

    // Add hover effect to rate cards
    rateCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Smooth scroll for "Get Started" and "Contact Us" buttons
    const actionButtons = document.querySelectorAll('.rate-card .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Optional: Add a simple animation to price on page load
    const prices = document.querySelectorAll('.price');
    prices.forEach(price => {
        let startValue = 0;
        const endValue = parseInt(price.textContent.replace(/\D/g,''));
        const duration = 1000;
        const startTime = new Date().getTime();

        const animateValue = () => {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
                const tempValue = Math.round((elapsedTime / duration) * endValue);
                price.textContent = isNaN(tempValue) ? 'Custom' : '$' + tempValue;
                requestAnimationFrame(animateValue);
            } else {
                price.textContent = isNaN(endValue) ? 'Custom' : '$' + endValue;
            }
        };

        animateValue();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            sendFormData();
        }
    });

    function validateForm() {
        let isValid = true;

        if (nameInput.value.trim() === '') {
            setErrorFor(nameInput, 'Name cannot be blank');
            isValid = false;
        } else {
            setSuccessFor(nameInput);
        }

        if (emailInput.value.trim() === '') {
            setErrorFor(emailInput, 'Email cannot be blank');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            setErrorFor(emailInput, 'Email is not valid');
            isValid = false;
        } else {
            setSuccessFor(emailInput);
        }

        if (messageInput.value.trim() === '') {
            setErrorFor(messageInput, 'Message cannot be blank');
            isValid = false;
        } else {
            setSuccessFor(messageInput);
        }

        return isValid;
    }

    function setErrorFor(input, message) {
        const formGroup = input.parentElement;
        const small = formGroup.querySelector('small');
        formGroup.className = 'form-group error';
        small.innerText = message;
    }

    function setSuccessFor(input) {
        const formGroup = input.parentElement;
        formGroup.className = 'form-group success';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function sendFormData() {
        const formData = new FormData(form);
        
        fetch('/submit-form', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessMessage();
                form.reset();
            } else {
                showErrorMessage(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An error occurred. Please try again later.');
        });
    }

    function showSuccessMessage() {
        alert('Message sent successfully!');
        // You can replace this with a more user-friendly notification
    }

    function showErrorMessage(message) {
        alert(message);
        // You can replace this with a more user-friendly notification
    }
});

