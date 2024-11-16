// Import Firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBO9TitTfnCA7LlqMCiF7SjTBHXHnc7CdU",
    authDomain: "metacode-message-stsyem.firebaseapp.com",
    projectId: "metacode-message-stsyem",
    storageBucket: "metacode-message-stsyem.firebasestorage.app",
    messagingSenderId: "418039923746",
    appId: "1:418039923746:web:1690852b2d4c93c6d2f67b",
    measurementId: "G-F2GXH1ZJSC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            sendFormData();
        });
    }

    function sendFormData() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.timestamp = Date.now(); // Add a timestamp

        const messagesRef = ref(db, 'messages/' + new Date().getTime());

        set(messagesRef, data)
            .then(() => {
                // Show the toast message
                 // Show toast notification
 const toastElement = document.getElementById('formToast');
 const toast = new bootstrap.Toast(toastElement);
 toast.show(); // Show the toast

 // Automatically hide the toast after 3 seconds
 setTimeout(() => {
     toast.hide(); // Hide the toast
 }, 5000); // 3000 milliseconds = 3 seconds

                form.reset(); // Reset the form
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Something went wrong! Please try again later.'); // You can keep this alert for error handling
            });
    }
}); 