// Product Data Array with Price in BDT (৳)
const products = [
    { id: 1, name: "Premium Wireless Headphones", price: 3500, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400" },
    { id: 2, name: "Smartwatch Series 8 Ultra", price: 4200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400" },
    { id: 3, name: "Mechanical Gaming Keyboard", price: 2800, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400" },
    { id: 4, name: "RGB Gaming Mouse", price: 1500, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=400" }
];

let cart = [];
let currentUser = null; 

// Run when the webpage loads
window.onload = function() {
    displayProducts();
    checkLoginStatus(); 
    updateCartUI();
};

// Dynamically display products
function displayProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;
    container.innerHTML = "";
    
    products.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">৳ ${product.price.toLocaleString()}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
}

// Check if user is already logged in
function checkLoginStatus() {
    const sessionUser = localStorage.getItem('loggedInUser');
    if (sessionUser) {
        currentUser = JSON.parse(sessionUser);
        updateNavbar(true);
    } else {
        currentUser = null;
        updateNavbar(false);
    }
}

// Update navbar layout based on login status
function updateNavbar(isLoggedIn) {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    if (isLoggedIn) {
        navLinks.innerHTML = `
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#contact">Contact</a></li>
            <li class="user-greeting">Hello, ${currentUser.name}</li>
            <li><a href="#" onclick="handleLogout()">Logout</a></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#" onclick="toggleAccount()">Account</a></li>
        `;
    }
}

// Open or Close Account Popup Modal
function toggleAccount() {
    const modal = document.getElementById('account-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Switch between Login and Sign-Up Forms
function switchForm(formType) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (formType === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    }
}

// Handle Sign Up (Account Creation)
function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    if (localStorage.getItem(email)) {
        alert("This email is already registered!");
        return;
    }
    
    const user = { name, email, password };
    localStorage.setItem(email, JSON.stringify(user)); 
    
    alert("Registration Successful! Please login.");
    event.target.reset();
    switchForm('login');
}

// Handle Login (Persistent Session)
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const storedUser = localStorage.getItem(email);
    
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.password === password) {
            alert(`Welcome back, ${user.name}!`);
            
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            currentUser = user;
            
            updateNavbar(true);
            toggleAccount(); 
            event.target.reset();
        } else {
            alert("Wrong password!");
        }
    } else {
        alert("No account found with this email.");
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('loggedInUser'); 
    alert("Logged out successfully!");
    location.reload(); 
}

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('cart-total-price');
    
    if (!cartCount || !cartItemsContainer || !totalPriceContainer) return;

    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    cartItemsContainer.innerHTML = "";
    let totalCost = 0;

    cart.forEach(item => {
        totalCost += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <small>৳ ${item.price} x ${item.quantity}</small>
                </div>
                <strong>৳ ${(item.price * item.quantity).toLocaleString()}</strong>
            </div>
        `;
    });

    totalPriceContainer.innerText = totalCost.toLocaleString();
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Checkout Logic (Ensuring user is logged-in)
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    if (!currentUser) {
        alert("You must log in to your account to place an order!");
        toggleCart(); 
        toggleAccount(); 
        return;
    }
    
    alert(`Thank you, ${currentUser.name}! Your order has been placed successfully. We will contact you at ${currentUser.email}.`);
    cart = [];
    updateCartUI();
    toggleCart();
}