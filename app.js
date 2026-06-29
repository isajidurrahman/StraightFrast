// Your Firebase Configuration (Get this from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyAOFBbBny7hTDIHRBPN6kBzNMQwmr9nc1o",
  authDomain: "straightfrast.firebaseapp.com",
  projectId: "straightfrast",
  storageBucket: "straightfrast.firebasestorage.app",
  messagingSenderId: "586402221916",
  appId: "1:586402221916:web:9430bdaba6982dbef73b99",
  measurementId: "G-Q6PWTD2M9V"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Global user state variables
let currentUser = null;

// Track Authentication State (Triggers Automatically on Login/Logout)
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        document.getElementById('auth-form-container').classList.add('hidden');
        document.getElementById('profile-container').classList.remove('hidden');
        document.getElementById('auth-status').innerText = `Logged in as: ${user.email}`;
        
        // Fetch User Profile from Firestore to Autofill Checkout
        fetchAndPopulateProfile(user.uid, user.email);
    } else {
        currentUser = null;
        document.getElementById('auth-form-container').classList.remove('hidden');
        document.getElementById('profile-container').classList.add('hidden');
        document.getElementById('auth-status').innerText = "Not logged in";
        clearCheckoutForm();
    }
});

// 1. Sign Up Function
function signUp() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    if(!email || !password) return alert("Please fill in auth fields");

    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            // Create empty profile doc in Firestore
            return db.collection('users').doc(cred.user.uid).set({
                uid: cred.user.uid,
                email: email,
                name: "",
                phone: "",
                address: "",
                profilePicUrl: "https://via.placeholder.com/80"
            });
        })
        .catch(err => alert(err.message));
}

// 2. Log In Function
function logIn() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    if(!email || !password) return alert("Please fill in auth fields");

    auth.signInWithEmailAndPassword(email, password)
        .catch(err => alert(err.message));
}

// 3. Log Out Function
function logOut() {
    auth.signOut();
}

// 4. Fetch Profile & Autofill Checkout Form Automatically
function fetchAndPopulateProfile(uid, email) {
    db.collection('users').doc(uid).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            
            // Populate Profile Settings Fields
            document.getElementById('user-name').value = data.name || "";
            document.getElementById('user-phone').value = data.phone || "";
            document.getElementById('user-address').value = data.address || "";
            if(data.profilePicUrl) {
                document.getElementById('profile-pic-preview').src = data.profilePicUrl;
            }
            document.getElementById('welcome-user').innerText = `Hello, ${data.name || 'User'}!`;

            // CRITICAL FEATURE: Automatically autofill checkout details
            document.getElementById('checkout-name').value = data.name || "";
            document.getElementById('checkout-phone').value = data.phone || "";
            document.getElementById('checkout-email').value = email || "";
            document.getElementById('checkout-address').value = data.address || "";
        }
    });
}

// 5. Save/Update Profile details (Including image upload to Firebase Storage)
async function saveProfile() {
    if (!currentUser) return;
    
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const address = document.getElementById('user-address').value;
    const fileInput = document.getElementById('profile-pic-input');
    let downloadURL = document.getElementById('profile-pic-preview').src;

    // Check if user uploaded a new profile image
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const storageRef = storage.ref(`profile_pics/${currentUser.uid}/${file.name}`);
        const uploadTask = await storageRef.put(file);
        downloadURL = await uploadTask.ref.getDownloadURL();
    }

    // Save package into Firestore
    db.collection('users').doc(currentUser.uid).update({
        name: name,
        phone: phone,
        address: address,
        profilePicUrl: downloadURL
    }).then(() => {
        alert("Profile securely updated!");
        fetchAndPopulateProfile(currentUser.uid, currentUser.email);
    }).catch(err => alert(err.message));
}

// 6. Order Placement: Sends order directly to your Firestore database
function placeOrder(event) {
    event.preventDefault();

    const orderData = {
        customerName: document.getElementById('checkout-name').value,
        customerPhone: document.getElementById('checkout-phone').value,
        customerEmail: document.getElementById('checkout-email').value,
        deliveryAddress: document.getElementById('checkout-address').value,
        items: [{ productName: "Premium Minimalist T-Shirt", price: 25.00, qty: 1 }],
        orderDate: new Date().toISOString(),
        status: "Pending",
        userId: currentUser ? currentUser.uid : "Guest"
    };

    // Save order data under 'orders' collection for the owner
    db.collection('orders').add(orderData)
        .then(() => {
            alert("Success! Your order has been placed. Straightfrast team will process it shortly.");
            if(!currentUser) clearCheckoutForm();
        })
        .catch(err => alert("Error processing order: " + err.message));
}

function clearCheckoutForm() {
    document.getElementById('order-form').reset();
}