// Get cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const checkoutItems = document.getElementById('checkout-items');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const grandTotalElement = document.getElementById('grand-total');
const paymentForm = document.getElementById('payment-form');


const SHIPPING_COST = 10.00;


const successModal = document.createElement('div');
successModal.className = 'success-modal';
successModal.innerHTML = `
    <div class="success-content">
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        <button onclick="window.location.href='index.html'">Continue Shopping</button>
    </div>
`;
document.body.appendChild(successModal);

// Display cart items and calculate totals
function displayCheckoutItems() {
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="checkout-item-details">
                <h4>${item.name}</h4>
                <p class="category">${item.category}</p>
                <p>Quantity: ${item.quantity}</p>
                <p class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? SHIPPING_COST : 0;
    const grandTotal = subtotal + shipping;

    // Update total displays
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
}

// Handle form submission
paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        card: document.getElementById('card').value,
        expiry: document.getElementById('expiry').value,
        cvv: document.getElementById('cvv').value
    };

    // Validate card number (simple validation)
    if (!validateCardNumber(formData.card)) {
        alert('Please enter a valid card number');
        return;
    }

    // Validate expiry date
    if (!validateExpiryDate(formData.expiry)) {
        alert('Please enter a valid expiry date (MM/YY)');
        return;
    }

    // Validate CVV
    if (!validateCVV(formData.cvv)) {
        alert('Please enter a valid CVV');
        return;
    }

    // Process order
    processOrder(formData);
});

// Validation functions
function validateCardNumber(cardNumber) {
    // Remove spaces and dashes
    cardNumber = cardNumber.replace(/[\s-]/g, '');
    // Check if it's a number and has 13-19 digits
    return /^\d{13,19}$/.test(cardNumber);
}

function validateExpiryDate(expiry) {
    // Check format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    // Check if month is valid (1-12)
    if (month < 1 || month > 12) return false;

    // Check if card is expired
    if (year < currentYear || (year == currentYear && month < currentMonth)) return false;

    return true;
}

function validateCVV(cvv) {
    // Check if it's a 3 or 4 digit number
    return /^\d{3,4}$/.test(cvv);
}

// Process order
function processOrder(formData) {

    const orderDetails = {
        items: cart,
        customer: formData,
        total: parseFloat(grandTotalElement.textContent.replace('$', '')),
        orderDate: new Date().toISOString()
    };

    // Clear cart
    localStorage.removeItem('cart');
    
    // Show success modal
    successModal.classList.add('active');
}

// Initialize checkout page
displayCheckoutItems(); 