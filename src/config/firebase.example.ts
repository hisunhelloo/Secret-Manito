import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: 본인의 Firebase 설정값으로 변경 후 'firebase.ts'로 이름을 바꾸세요.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 캔버스 환경과 달리 로컬에서는 직접 ID를 지정하거나 하드코딩해도 됩니다.
export const appId = "my-manito-app";
export const COLLECTION_NAME = 'manito_rooms';
