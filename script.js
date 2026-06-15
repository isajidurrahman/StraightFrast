// Product Data Array with Price in BDT (৳)
const products = [
    { id: 1, name: "Premium Wireless Headphones", price: 3500, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400" },
    { id: 2, name: "Smartwatch Series 8 Ultra", price: 4200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400" },
    { id: 3, name: "Mechanical Gaming Keyboard", price: 2800, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400" },
    { id: 4, name: "RGB Gaming Mouse", price: 1500, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=400" }
];

let cart = [];

// Function to dynamically load products onto the webpage
function displayProducts() {
    const container = document.getElementById('product-container');
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

// Function to handle adding items to the cart
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

// Function to update the Shopping Cart User Interface
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('cart-total-price');
    
    // Calculate total quantity of items
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Generate cart item rows
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

// Function to Open or Close the Cart Modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Function to handle the checkout process
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Thank you! Your order has been placed successfully.");
    cart = [];
    updateCartUI();
    toggleCart();
}

// Initialise product display when the page loads
window.onload = displayProducts;
// Product Data Array with Price in BDT (৳)
const products = [
    { id: 1, name: "Premium Wireless Headphones", price: 3500, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400" },
    { id: 2, name: "Smartwatch Series 8 Ultra", price: 4200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400" },
    { id: 3, name: "Mechanical Gaming Keyboard", price: 2800, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400" },
    { id: 4, name: "RGB Gaming Mouse", price: 1500, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=400" }
];

let cart = [];
let currentUser = null; // Stores the currently logged-in user session

// 1. Initialize website, check login session and load products on page load
window.onload = function() {
    displayProducts();
    checkLoginStatus(); 
    updateCartUI();
};

// 2. Function to dynamically display products on the website
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

// 3. Check login status from localStorage and update navbar accordingly
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

// 4. Update navbar links based on user authentication state
function updateNavbar(isLoggedIn) {
    const navUl = document.querySelector('nav ul');
    if (!navUl) return;

    if (isLoggedIn) {
        navUl.innerHTML = `
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#contact">Contact</a></li>
            <li style="color: #ff4757; font-weight: bold; margin: 0 15px;">Hello, ${currentUser.name}</li>
            <li><a href="#" onclick="handleLogout()">Logout</a></li>
        `;
    } else {
        navUl.innerHTML = `
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#" onclick="toggleAccount()">Account</a></li>
        `;
    }
}

// 5. Open or close the Account Modal popup
function toggleAccount() {
    const modal = document.getElementById('account-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// 6. Switch between Login and Sign-Up forms inside the modal
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

// 7. Handle the user Registration (Sign-Up) process
function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Check if the email is already registered
    if (localStorage.getItem(email)) {
        alert("This email is already registered!");
        return;
    }
    
    const user = { name, email, password };
    localStorage.setItem(email, JSON.stringify(user)); // Saved into local database
    
    alert("Registration successful! Please login.");
    event.target.reset();
    switchForm('login');
}

// 8. Handle the user Login process and persist session
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const storedUser = localStorage.getItem(email);
    
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.password === password) {
            alert(`Welcome back, ${user.name}!`);
            
            // Keep the user logged in even after page refresh or browser restart
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            
            currentUser = user;
            updateNavbar(true);
            toggleAccount(); 
            event.target.reset();
        } else {
            alert("Incorrect password! Please try again.");
        }
    } else {
        alert("No account found with this email. Please sign up.");
    }
}

// 9. Handle user Logout
function handleLogout() {
    localStorage.removeItem('loggedInUser'); // Clears the current login session
    alert("Logged out successfully!");
    location.reload(); // Reload the page to reset the navbar
}

// 10. Add products to the shopping cart
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

// 11. Update the Cart User Interface and counts
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

// 12. Open or close the Cart Modal popup
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// 13. Handle Checkout with complete user verification