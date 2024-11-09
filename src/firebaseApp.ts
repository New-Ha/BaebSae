import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 매 호출시마다 initialize 하지 않고, 처음에 initialize한게 있으면 getApp으로 가져오게 하기 위해서
export let app: FirebaseApp;

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

try {
    app = getApp('app');
} catch (e) {
    app = initializeApp(firebaseConfig, 'app');
}

const firebase = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export default firebase;
