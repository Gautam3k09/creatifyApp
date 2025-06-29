import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));


import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
     apiKey: "AIzaSyA224y1l8vtyrIOyNYZXV-l-FTP8IxpVQ0",
     authDomain: "createefi.firebaseapp.com",
     projectId: "createefi",
     storageBucket: "createefi.firebasestorage.app",
     messagingSenderId: "406760097789",
     appId: "1:406760097789:web:28f03972e157aded21bb94",
     measurementId: "G-R9SB620F46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);