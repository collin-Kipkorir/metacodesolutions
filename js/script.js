document.addEventListener('DOMContentLoaded', function() {
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

    // Back to Top button
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("back-to-top").style.display = "block";
        } else {
            document.getElementById("back-to-top").style.display = "none";
        }
    }

    window.onscroll = scrollFunction;

    document.getElementById("back-to-top").onclick = function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    };

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
            alert('Redirecting to payment gateway...');
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

    // Rate card hover effects
    const rateCards = document.querySelectorAll('.rate-card');
    rateCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            this.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Handle modal form submissions
    const modalForms = document.querySelectorAll('.modal form');
    modalForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const planType = this.closest('.modal').id.replace('Modal', '');
            const formData = new FormData(this);
            
            console.log(`${planType} Plan submission:`, Object.fromEntries(formData));

            alert(`Thank you for your interest in our ${planType} plan! We'll contact you shortly.`);

            const modal = bootstrap.Modal.getInstance(this.closest('.modal'));
            modal.hide();
        });
    });

    // Animate price on page load
    const prices = document.querySelectorAll('.price');
    prices.forEach(price => {
        const endValue = parseInt(price.textContent.replace(/\D/g,''));
        if (!isNaN(endValue)) {
            animateValue(price, 0, endValue, 1500);
        }
    });

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = '$' + Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Contact form submission
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    form.addEventListener('submit', function(e) {
        console.log('Form submission intercepted');
        e.preventDefault();
        
        if (validateForm()) {
            console.log('Form is valid, sending data');
            sendFormData();
        } else {
            console.log('Form validation failed');
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
        console.log('Sending form data');
        const formData = new FormData(form);
        
        fetch('/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(response => {
            console.log('Received response', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Parsed response data', data);
            Swal.fire({
                title: 'WOW!',
                text: 'Your message has been sent successfully!',
                icon: 'success',
                confirmButtonText: 'Cool!',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Oops...',
                text: 'Something went wrong! Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }
});