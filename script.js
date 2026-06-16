// CONFIGURATION: Set your credentials here
const MY_WHATSAPP_NUMBER = "8801338478864"; // Put your WhatsApp number with country code (e.g., 88017XXXXXXXX)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mojzbqjl"; // Replace with your Formspree Endpoint ID later

const products = [
    { id: 1, name: "Premium Wireless Headphones", price: 3500, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400" },
    { id: 2, name: "Smartwatch Series 8 Ultra", price: 4200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400" },
    { id: 3, name: "Mechanical Gaming Keyboard", price: 2800, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400" },
    { id: 4, name: "RGB Gaming Mouse", price: 1500, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=400" }
];

let cart = [];
let currentUser = null; 

window.onload = function() {
    displayProducts();
    checkLoginStatus(); 
    updateCartUI();
};

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

function toggleAccount() {
    const modal = document.getElementById('account-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

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

function handleLogout() {
    localStorage.removeItem('loggedInUser'); 
    alert("Logged out successfully!");
    location.reload(); 
}

// Cart Management Code
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

// ---------------- NEW CHECKOUT FORM LOGIC ----------------

// Open Address Form Modal if user is logged in
function openCheckoutForm() {
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
    toggleCart(); // Close cart modal
    toggleCheckoutModal(); // Open address input modal
}

function toggleCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Function to handle Final Order Submission
function submitOrder(event) {
    event.preventDefault();

    const phone = document.getElementById('order-phone').value;
    const address = document.getElementById('order-address').value;
    const notificationType = document.getElementById('notification-type').value;

    // Calculate total price and compile item list text
    let totalCost = 0;
    let productDetailsText = "";
    
    cart.forEach(item => {
        totalCost += item.price * item.quantity;
        productDetailsText += `- ${item.name} (Qty: ${item.quantity}) - ৳${item.price * item.quantity}\n`;
    });

    const finalTotal = totalCost.toLocaleString();

    // OPTION 1: WhatsApp Method
    if (notificationType === 'whatsapp') {
        let whatsappMessage = `*New Order Placed on Straightfrast*\n\n`;
        whatsappMessage += `*Customer Name:* ${currentUser.name}\n`;
        whatsappMessage += `*Email:* ${currentUser.email}\n`;
        whatsappMessage += `*Phone:* ${phone}\n`;
        whatsappMessage += `*Delivery Address:* ${address}\n\n`;
        whatsappMessage += `*Ordered Items:*\n${productDetailsText}\n`;
        whatsappMessage += `*Total Amount:* ৳${finalTotal}`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        alert("Redirecting to WhatsApp to complete your order...");
        window.open(whatsappURL, '_blank');
        
        // Reset Cart and Form
        completeCheckoutProcess();
    } 
    // OPTION 2: Email Method (Using Formspree API)
    else if (notificationType === 'email') {
        if (FORMSPREE_ENDPOINT.includes("your_form_id")) {
            alert("Error: Admin has not configured the Email Formspree ID yet! Please try WhatsApp instead.");
            return;
        }

        const emailData = {
            customer_name: currentUser.name,
            customer_email: currentUser.email,
            phone: phone,
            address: address,
            ordered_items: productDetailsText,
            total_amount: `৳${finalTotal}`
        };

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(emailData)
        })
        .then(response => {
            if (response.ok) {
                alert(`Thank you, ${currentUser.name}! Your order has been emailed to us successfully.`);
                completeCheckoutProcess();
            } else {
                alert("Something went wrong with the email server. Please try using WhatsApp.");
            }
        })
        .catch(error => {
            alert("Network error. Please try again.");
        });
    }
}

function completeCheckoutProcess() {
    cart = [];
    updateCartUI();
    toggleCheckoutModal();
    document.getElementById('order-form').reset();
}