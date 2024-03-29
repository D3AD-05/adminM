import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  PhoneAuthProvider,
  signInWithPhoneNumber,
} from "firebase/auth";
import "firebase/storage";
// const firebaseConfig = {
//   apiKey: "AIzaSyC29QTKWcLuSeZkBXVfMedhmZy69Oq5z6k",
//   authDomain: "test-f56db.firebaseapp.com",
//   projectId: "test-f56db",
//   storageBucket: "test-f56db.appspot.com",
//   messagingSenderId: "361684335587",
//   appId: "1:361684335587:web:86d9bdc2c96fbd3c52fed6",
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDGr9fNXs3nBqfDesilmq81SKWidNHwdMg",
//   authDomain: "admin-563de.firebaseapp.com",
//   projectId: "admin-563de",
//   storageBucket: "admin-563de.appspot.com",
//   messagingSenderId: "909219776195",
//   appId: "1:909219776195:web:bc82d9acd1b071435d8476",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDAkSjGqn_N1Z5fmdIia7-M0UI64w5Ffmc",
  authDomain: "auth-f21bf.firebaseapp.com",
  projectId: "auth-f21bf",
  storageBucket: "auth-f21bf.appspot.com",
  messagingSenderId: "572517852102",
  appId: "1:572517852102:web:f13e1495afcd95b92848c7",
  measurementId: "G-RDJQBT93ZR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

//  google authentication
export const siginWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // const dp = result.user.photoURL;
      const name = result.user.displayName;
      console.log(name);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Phone OTP
export const sendCodeToPhone = async (phoneNumber) => {
  try {
    const auth = getAuth();
    const appVerifier = new PhoneAuthProvider(auth);
    const confirmationResult = await signInWithPhoneNumber(
      appVerifier,
      phoneNumber
    );
    // Save the confirmationResult for later use
    return confirmationResult;
  } catch (error) {
    console.error("Error sending code:", error);
    throw error;
  }
};

export const signInWithPhoneCode = async (
  confirmationResult,
  verificationCode
) => {
  try {
    const credential = PhoneAuthProvider.credentialFromInput(
      confirmationResult,
      verificationCode
    );
    await auth.signInWithCredential(credential);
    // User is now authenticated
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

export default app;
