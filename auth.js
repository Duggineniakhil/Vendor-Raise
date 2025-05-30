// Vendor Registration Form
const vendorRegisterForm = document.getElementById('vendorRegisterForm');

if (vendorRegisterForm) {
    vendorRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const businessName = document.getElementById('vendor-name').value.trim();
        const email = document.getElementById('vendor-email').value.trim();
        const password = document.getElementById('vendor-password').value;
        const confirmPassword = document.getElementById('vendor-confirm-password').value;
        const businessType = document.getElementById('vendor-business-type').value;
        
        // Validate form
        if (!businessName || !email || !password || !confirmPassword || !businessType) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Check if email already exists
        let vendors = JSON.parse(localStorage.getItem('vendors')) || [];
        const emailExists = vendors.some(vendor => vendor.email === email);
        
        if (emailExists) {
            alert('Email already registered. Please login instead.');
            return;
        }
        
        // Create new vendor
        const newVendor = {
            id: generateId(),
            type: 'vendor',
            businessName,
            email,
            password, // Note: In a real app, never store plain text passwords
            businessType,
            dateRegistered: new Date().toISOString(),
            loans: []
        };
        
        vendors.push(newVendor);
        localStorage.setItem('vendors', JSON.stringify(vendors));
        
        // Log in the new vendor
        localStorage.setItem('currentUser', JSON.stringify(newVendor));
        
        // Redirect to vendor dashboard
        window.location.href = 'vendor-dash.html';
    });
}

// Lender Registration Form
const lenderRegisterForm = document.getElementById('lenderRegisterForm');

if (lenderRegisterForm) {
    lenderRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('lender-name').value.trim();
        const email = document.getElementById('lender-email').value.trim();
        const password = document.getElementById('lender-password').value;
        const confirmPassword = document.getElementById('lender-confirm-password').value;
        const lenderType = document.getElementById('lender-type').value;
        
        // Validate form
        if (!name || !email || !password || !confirmPassword || !lenderType) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Check if email already exists
        let lenders = JSON.parse(localStorage.getItem('lenders')) || [];
        const emailExists = lenders.some(lender => lender.email === email);
        
        if (emailExists) {
            alert('Email already registered. Please login instead.');
            return;
        }
        
        // Create new lender
        const newLender = {
            id: generateId(),
            type: 'lender',
            name,
            email,
            password, // Note: In a real app, never store plain text passwords
            lenderType,
            dateRegistered: new Date().toISOString(),
            investments: []
        };
        
        lenders.push(newLender);
        localStorage.setItem('lenders', JSON.stringify(lenders));
        
        // Log in the new lender
        localStorage.setItem('currentUser', JSON.stringify(newLender));
        
        // Redirect to lender dashboard
        window.location.href = 'lender-dash.html';
    });
}
document.getElementById("lenderRegisterForm").addEventListener("submit", function (e) {
    e.preventDefault(); // prevent actual submission
    // add validation if needed
    window.location.href = "lendor-dash.html"; // redirect to dashboard
});


// Vendor Login Form
const vendorLoginForm = document.getElementById('vendorLoginForm');

if (vendorLoginForm) {
    vendorLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('vendor-email').value.trim();
        const password = document.getElementById('vendor-password').value;
        
        // Validate form
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Check credentials
        let vendors = JSON.parse(localStorage.getItem('vendors')) || [];
        const vendor = vendors.find(v => v.email === email && v.password === password);
        
        if (!vendor) {
            alert('Invalid email or password');
            return;
        }
        
        // Log in the vendor
        localStorage.setItem('currentUser', JSON.stringify(vendor));
        
        // Redirect to vendor dashboard
        window.location.href = 'vendor-dash.html';
    });
}

// Lender Login Form
const lenderLoginForm = document.getElementById('lenderLoginForm');

if (lenderLoginForm) {
    lenderLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('lender-email').value.trim();
        const password = document.getElementById('lender-password').value;
        
        // Validate form
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Check credentials
        let lenders = JSON.parse(localStorage.getItem('lenders')) || [];
        const lender = lenders.find(l => l.email === email && l.password === password);
        
        if (!lender) {
            alert('Invalid email or password');
            return;
        }
        
        // Log in the lender
        localStorage.setItem('currentUser', JSON.stringify(lender));
        
        // Redirect to lender dashboard
        window.location.href = 'lender-dash.html';
    });
}

// Auto-select tab based on URL parameter
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    
    if (type === 'vendor' && document.getElementById('vendor-register')) {
        document.querySelector('[data-tab="vendor-register"]').click();
    } else if (type === 'lender' && document.getElementById('lender-register')) {
        document.querySelector('[data-tab="lender-register"]').click();
    } else if (type === 'vendor' && document.getElementById('vendor-login')) {
        document.querySelector('[data-tab="vendor-login"]').click();
    } else if (type === 'lender' && document.getElementById('lender-login')) {
        document.querySelector('[data-tab="lender-login"]').click();
    }
});

// Helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
