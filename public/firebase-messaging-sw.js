importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAwnvXjF75wbQeTse7AlUwWrrGimHavGHM",
    authDomain: "emme-b0ecc.firebaseapp.com",
    projectId: "emme-b0ecc",
    storageBucket: "emme-b0ecc.appspot.com",
    messagingSenderId: "474514207945",
    appId: "1:474514207945:web:8d3ad1c0f3e84dd5140918",
    measurementId: "G-L80GFJWCJR"
});

const isSupported = firebase.messaging.isSupported();
if (isSupported) {
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage(({ notification: { title, body, image } }) => {
        self.registration.showNotification(title, {
            body,
            icon: image || "/assets/icons/icon-72x72.png",  
        });
    });
}
