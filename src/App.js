import React, { useEffect, useState } from 'react';
import './firebase';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage'
import Search from './pages/Search';
import Quiz from './pages/Quiz'
import Profile from './pages/Profile'
import Friends from './pages/Friends'
import User from './pages/User'
import Login from './pages/Login'
import Suggestions from './pages/Suggestions'
import Artist from './pages/Artist'
import Album from './pages/Album'
import Notifications from './pages/Notifications';
import About from './pages/About';
import { auth, db } from './firebase';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import NotificationBuilder from './components/NotificationBuilder';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

function App() {

  useEffect(() => {
    document.title = 'EMME';
  }, []);

  const [user, loading, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [fcmToken, setFcmToken] = useState('')
  const [fcmMessages, setFcmMessages] = useState([]);

  const [userFCM, setUserFCM] = useState();

  useEffect(() => {
    if (user && !loading) {
      const messages =
        onMessage(getMessaging(), (payload) => {
          if (payload.data.forId === auth.currentUser.uid) {
            setShow(true);
            const messages = [...fcmMessages];
            messages.push(payload);
            setFcmMessages(messages);
            setTimeout(() => {
              const messages = [...fcmMessages];
              messages.pop(payload);
              setFcmMessages(messages);
            }, 3000)
          }
        });

      const token =
        getToken(getMessaging(), {
          vapidKey:
            "BKjRotcL3mAcRm9GybZc5ch0Iz_Gunnl9R_Y3Ccx-SUEka3DZgrd94swmX1RNqeKoszZR4IHMqBbXdqAdSMCnGc",
        }).then((currentToken) => {
          if (currentToken) {
            setFcmToken(currentToken);
            if (currentToken !== userFCM) {
              setUserFCM(currentToken);
              const userRef = doc(db, 'users', auth.currentUser.uid);
              updateDoc(userRef, {
                fcm: currentToken,
                fcmDate: serverTimestamp()
              }).then((response) => {
                console.log('User FCM Updated...');
              }).catch((error) => {
                console.log('fcm error -> ', error);
              })
            }
          } else {
            console.log("Can not get token");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  return (
    <>
      <BrowserRouter>
        <NotificationBuilder fcmMessages={fcmMessages} />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/search' element={<Search />} />
          <Route path='/quiz' element={<Quiz />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/user' element={<User />} />
          <Route path='/friends' element={<Friends />} />
          <Route path='/emmes' element={<Suggestions />} />
          <Route path='/artist' element={<Artist />} />
          <Route path='/album' element={<Album />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/wordle' element={<Quiz />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
