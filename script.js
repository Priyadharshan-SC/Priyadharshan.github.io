// --- Navigation and Scroll Animations ---
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Scroll animations for sections
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    sections.forEach(section => {
        observer.observe(section);
    });

    // Active nav link on scroll
    const sectionsForNav = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');

    const activateLink = (sectionId) => {
        navLinks.forEach(link => {
            link.classList.remove('text-amber-500', 'border-amber-500');
            link.classList.add('border-transparent');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('text-amber-500', 'border-amber-500');
                link.classList.remove('border-transparent');
            }
        });
        mobileNavLinks.forEach(link => {
            link.classList.remove('font-bold', 'text-amber-500');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('font-bold', 'text-amber-500');
            }
        });
    };

    const onScroll = () => {
        let currentSection = '';
        sectionsForNav.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - (header.offsetHeight || 120)) {
                currentSection = section.getAttribute('id');
            }
        });
        if (currentSection) {
            activateLink(currentSection);
        }
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('load', onScroll);
});


// --- Google Sheet Form Submission & Validation ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbyDPbYJHs5nwXCg4wTE5GwoUmst2IpqVmzkmLgcY-dD154YzYgklkmD-yzS_GAVv8FG9g/exec'; // IMPORTANT: Replace with your script URL
const form = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-button');
const successMessage = document.getElementById('form-success-message');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');

// --- Validation Functions ---
const setError = (input, message) => {
    const errorDiv = input.nextElementSibling;
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
    input.classList.add('border-red-500', 'focus:ring-red-500');
    input.classList.remove('focus:ring-amber-500');
};

const setSuccess = (input) => {
    const errorDiv = input.nextElementSibling;
    errorDiv.innerText = '';
    errorDiv.style.display = 'none';
    input.classList.remove('border-red-500', 'focus:ring-red-500');
    input.classList.add('focus:ring-amber-500');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const isValidPhone = phone => {
    // Validates a 10-digit Indian mobile number, optionally with +91
    const re = /^(?:\+91)?[6-9]\d{9}$/;
    return re.test(String(phone));
}

const validateInputs = () => {
    let isValid = true;
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const phoneValue = phoneInput.value.trim();
    const messageValue = messageInput.value.trim();

    if (nameValue === '') {
        setError(nameInput, 'Name is required');
        isValid = false;
    } else {
        setSuccess(nameInput);
    }

    if (emailValue === '') {
        setError(emailInput, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(emailInput, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(emailInput);
    }

    if (phoneValue === '') {
        setError(phoneInput, 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phoneValue)) {
        setError(phoneInput, 'Provide a valid 10-digit phone number');
        isValid = false;
    } else {
        setSuccess(phoneInput);
    }

    if (messageValue === '') {
        setError(messageInput, 'Message is required');
        isValid = false;
    } else {
        setSuccess(messageInput);
    }

    return isValid;
};


// --- Form Submission Logic ---
form.addEventListener('submit', e => {
    e.preventDefault();

    if (validateInputs()) {
        // Show loading state
        submitButton.querySelector('.button-text').style.display = 'none';
        submitButton.querySelector('.button-icon').style.display = 'none';
        submitButton.querySelector('.loader').style.display = 'block';
        submitButton.disabled = true;

        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                // Hide loading state
                submitButton.querySelector('.button-text').style.display = 'block';
                submitButton.querySelector('.button-icon').style.display = 'block';
                submitButton.querySelector('.loader').style.display = 'none';
                submitButton.disabled = false;

                // Show success message and reset form
                successMessage.style.display = 'block';
                form.reset();
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000); // Hide after 5 seconds
            })
            .catch(error => {
                console.error('Error!', error.message);
                 // Hide loading state
                submitButton.querySelector('.button-text').style.display = 'block';
                submitButton.querySelector('.button-icon').style.display = 'block';
                submitButton.querySelector('.loader').style.display = 'none';
                submitButton.disabled = false;

                // You could show an error message to the user here
                alert('An error occurred. Please try again.');
            });
    }
});

