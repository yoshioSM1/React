import firebaseAcademia from './firebaseConfig';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
const auth = getAuth(firebaseAcademia);

export const signinUser = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential);
    })
    .catch((error) => {
      console.log(error);
    });
};
export const logoutFirebase = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log('cerró sesión');
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
};

export const userListener = (listener) => {
  onAuthStateChanged(auth, (user) => {
    listener(user);
  });
};
