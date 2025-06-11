// Sample products data with categories
const products = [
    // Electronics Category
    {
        id: 1,
        name: "Smartphone",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Laptop",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Headphones",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        category: "Electronics"
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        category: "Electronics"
    },
    {
        id: 5,
        name: "Gaming Console",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500",
        category: "Electronics"
    },
    // Fashion Category
    {
        id: 6,
        name: "Men's T-Shirt",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        category: "Fashion"
    },
    {
        id: 7,
        name: "Women's Dress",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
        category: "Fashion"
    },
    {
        id: 8,
        name: "Running Shoes",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        category: "Fashion"
    },
    // Home & Living Category
    {
        id: 9,
        name: "Coffee Maker",
        price: 79.99,
        image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
        category: "Home & Living"
    },
    {
        id: 10,
        name: "Bed Sheets",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500",
        category: "Home & Living"
    },
    // Books Category
    {
        id: 11,
        name: "Novel Collection",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
        category: "Books"
    },
    {
        id: 12,
        name: "Cookbook",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500",
        category: "Books"
    }
];

// Cart array to store items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalAmount = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryFilter = document.getElementById('category-filter');

// Get unique categories
const categories = [...new Set(products.map(product => product.category))];

// Display category filter
function displayCategoryFilter() {
    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
        ${categories.map(category => `
            <option value="${category}">${category}</option>
        `).join('')}
    `;
}

// Display products with category filter
function displayProducts(selectedCategory = 'all') {
    const filteredProducts = selectedCategory === 'all' 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="category-tag">${product.category}</div>
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    saveCart();
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/50?text=No+Image'">
            <div>
                <h4>${item.name}</h4>
                <p class="category">${item.category}</p>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    // Update total amount
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = total.toFixed(2);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// Event Listeners
checkoutBtn.addEventListener('click', checkout);
categoryFilter.addEventListener('change', (e) => displayProducts(e.target.value));

// Initialize the page
displayCategoryFilter();
displayProducts();
updateCart(); 