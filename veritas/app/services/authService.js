import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

// Handle user login with email and password
export const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user; // Getting the logged-in user from the userCredential object
            console.log("Logged In User - " + user.email); // Log the user's email to the console
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Login Error: " + errorMessage);
        });
}

// Handle user signup with email and password
export const handleSignup = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user; // Getting the newly created user from the userCredential object
            console.log("Signed Up User - " + user.email); // Log the signed-up user's email to the console
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Signup Error: " + errorMessage);
        });
}

// Handle user logout
export const handleLogout = () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out successfully"); // Log a success message when the user is logged out
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Logout Error: " + errorMessage);
        });
}
