// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOFBbBny7hTDIHRBPN6kBzNMQwmr9nc1o",
    authDomain: "straightfrast.firebaseapp.com",
    projectId: "straightfrast",
    storageBucket: "straightfrast.firebasestorage.app",
    messagingSenderId: "586402221916",
    appId: "1:586402221916:web:9430bdaba6982dbef73b99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Mock Clothing Products Data
const products = [
    { id: 1, name: "Premium Black Hoodie", price: 45, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500" },
    { id: 2, name: "Vintage Denim Jacket", price: 65, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500" },
    { id: 3, name: "Classic White T-Shirt", price: 25, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" },
    { id: 4, name: "Slim Fit Chino Pants", price: 39, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500" }
];

let cart = [];
let currentUser = null;

// Render Products
const productGrid = document.getElementById('product-grid');
products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="price">$${product.price}</div>
        <button class="btn-add-cart" data-id="${product.id}">Add to Cart</button>
    `;
    productGrid.appendChild(productCard);
});

// Auth Logic (Sign Up)
document.getElementById('btn-signup').addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Account Created Successfully!");
    } catch (error) {
        alert(error.message);
    }
});

// Auth Logic (Login)
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged In Successfully!");
    } catch (error) {
        alert(error.message);
    }
});

// Auth Logic (Logout)
document.getElementById('btn-logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        alert("Logged Out!");
        location.reload();
    });
});

// Monitor Auth State & Auto-populate Checkout
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('user-profile').classList.remove('hidden');
        
        // Fetch user metadata from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('user-name').value = data.name || '';
            document.getElementById('user-phone').value = data.phone || '';
            document.getElementById('user-address').value = data.address || '';
            if (data.profilePic) {
                document.getElementById('profile-pic-view').src = data.profilePic;
            }

            // AUTOMATICALLY autofill checkout fields
            document.getElementById('checkout-name').value = data.name || '';
            document.getElementById('checkout-email').value = user.email || '';
            document.getElementById('checkout-phone').value = data.phone || '';
            document.getElementById('checkout-address').value = data.address || '';
        } else {
            // If new user, just autofill email
            document.getElementById('checkout-email').value = user.email;
        }
    } else {
        currentUser = null;
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('user-profile').classList.add('hidden');
    }
});

// Save Profile Info (with Image Upload)
document.getElementById('btn-save-profile').addEventListener('click', async () => {
    if (!currentUser) return alert("Please log in first.");
    
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const address = document.getElementById('user-address').value;
    const fileInput = document.getElementById('profile-pic-input');
    let profilePicUrl = document.getElementById('profile-pic-view').src;

    try {
        // Upload image to Firebase Storage if selected
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const storageRef = ref(storage, `profiles/${currentUser.uid}`);
            const snapshot = await uploadBytes(storageRef, file);
            profilePicUrl = await getDownloadURL(snapshot.ref);
            document.getElementById('profile-pic-view').src = profilePicUrl;
        }

        // Save textual data to Firestore
        await setDoc(doc(db, "users", currentUser.uid), {
            name: name,
            phone: phone,
            address: address,
            profilePic: profilePicUrl
        }, { merge: true });

        alert("Profile Updated Successfully!");
        
        // Update checkout inputs instantly
        document.getElementById('checkout-name').value = name;
        document.getElementById('checkout-phone').value = phone;
        document.getElementById('checkout-address').value = address;

    } catch (error) {
        console.error(error);
        alert("Failed to save profile: " + error.message);
    }
});

// Cart Logic
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
        const pId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === pId);
        cart.push(product);
        updateCartUI();
    }
});

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `<span>${item.name}</span> <span>$${item.price}</span>`;
        cartItemsDiv.appendChild(itemDiv);
    });
    document.getElementById('cart-total-price').innerText = total;
}

// Checkout & Order Submission to Admin (Firestore)
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");

    const orderData = {
        customerName: document.getElementById('checkout-name').value,
        email: document.getElementById('checkout-email').value,
        phone: document.getElementById('checkout-phone').value,
        shippingAddress: document.getElementById('checkout-address').value,
        items: cart,
        totalAmount: document.getElementById('cart-total-price').innerText,
        userId: currentUser ? currentUser.uid : "Guest",
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    try {
        // Save order to a global 'orders' collection for the admin
        await addDoc(collection(db, "orders"), orderData);
        alert("Order Placed Successfully! Your order has been sent to the admin.");
        cart = [];
        updateCartUI();
        document.getElementById('checkout-form').reset();
    } catch (error) {
        alert("Order failed: " + error.message);
    }
});