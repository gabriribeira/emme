import React, { useEffect, useState } from 'react';
import { HiClock } from 'react-icons/hi'
import { doc, collection, getDoc, getDocs, orderBy, query, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../firebase';
import { CgClose } from 'react-icons/cg';
import { BsEmojiFrown, BsEmojiSmile } from 'react-icons/bs';
import sendNotificationToFCM from '../utils/notifications';
import {AiOutlineUser} from 'react-icons/ai'

const Suggestions = () => {

  const [user, setUser] = useState('')
  const [documentos, setDocs] = useState();
  const [docsId, setDocsId] = useState('');
  const [likedDocs, setLikedDocs] = useState();
  const [likedDocsId, setLikedDocsId] = useState('');
  const [dislikedDocs, setDislikedDocs] = useState();
  const [dislikedDocsId, setDislikedDocsId] = useState('');
  const [menu, setMenu] = useState(0);
  const [btn0Menu, setBtn0Menu] = useState('col-span-1 py-3 outline-none focus:outline-none');
  const [btn1Menu, setBtn1Menu] = useState('col-span-1 bg-preto/20 py-3');
  const [btn2Menu, setBtn2Menu] = useState('col-span-1 bg-preto/20 py-3');
  const [modal, setModal] = useState('hidden');
  const [selectedEmmeId, setSelectedEmmeId] = useState('');
  const [selectedEmmeDocId, setSelectedEmmeDocId] = useState('')
  const [selectedEmmeName, setSelectedEmmeName] = useState('');
  const [selectedEmmeArtist, setSelectedEmmeArtist] = useState('');
  const [selectedEmmeImage, setSelectedEmmeImage] = useState('');
  const [selectedEmmeDate, setSelectedEmmeDate] = useState('');
  const [selectedEmmeFriend, setSelectedEmmeFriend] = useState('');
  const [selectedEmmeFriendId, setSelectedEmmeFriendId] = useState('');
  const [selectedEmmeFriendImage, setSelectedEmmeFriendImage] = useState('')
  const [selectedAlbumId, setSelectedAlbumId] = useState('')

  const [selectedEmmeFriendUsername, setSelectedEmmeFriendUsername] = useState('')
  const [selectedEmmeFriendFcm, setSelectedEmmeFriendFcm] = useState('');
  const [selectedEmmeMessage, setSelectedEmmeMessage] = useState('');
  const [thumbsDown, setThumbsDown] = useState('text-4xl mx-7 group text-cinza');
  const [thumbsUp, setThumbsUp] = useState('text-4xl mx-7 group text-cinza');
  const [newDisliked, setNewDisliked] = useState(0);
  const [newLiked, setNewLiked] = useState(0);

  const [reaction, setReaction] = useState();

  const navigate = useNavigate();

  useEffect(() => {

    var docsArray = [];
    var docsIdArray = [];

    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const getUserId = () => {
          const userSearchId = auth.currentUser.uid;
          setUser(userSearchId);
        }
        getUserId();
        getEmmes()
      }
    });

    unsub();

    const getEmmes = async () => {

      const emmes = await getDocs(query(collection(db, `users/${auth.currentUser.uid}/emmes`), orderBy("createdAt", "desc")));

      emmes.forEach((doc) => {
        docsArray.push(doc.data());
        docsIdArray.push(doc.id);
      });

      setDocs(docsArray);
      setDocsId(docsIdArray);

    }

  }, [newLiked, newDisliked]);

  useEffect(() => {

    var docsArray = [];
    var docsIdArray = [];

    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const getUserId = () => {
          const userSearchId = auth.currentUser.uid;
          setUser(userSearchId);
        }
        getUserId();
        getLikedEmmes();
      }
    });

    unsub();

    const getLikedEmmes = async () => {

      const emmes = await getDocs(query(collection(db, `users/${auth.currentUser.uid}/likedEmmes`), orderBy("createdAt", "desc")));

      emmes.forEach((doc) => {
        docsArray.push(doc.data());
        docsIdArray.push(doc.id);
      });

      setLikedDocs(docsArray);
      setLikedDocsId(docsIdArray);

    }

  }, [newLiked]);

  useEffect(() => {

    var docsArray = [];
    var docsIdArray = [];

    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const getUserId = () => {
          const userSearchId = auth.currentUser.uid;
          setUser(userSearchId);
        }
        getUserId();
        getDislikedEmmes();
      }
    });

    unsub();

    const getDislikedEmmes = async () => {

      const emmes = await getDocs(query(collection(db, `users/${auth.currentUser.uid}/dislikedEmmes`), orderBy("createdAt", "desc")));

      emmes.forEach((doc) => {
        docsArray.push(doc.data());
        docsIdArray.push(doc.id);
      });

      setDislikedDocs(docsArray);
      setDislikedDocsId(docsIdArray);

    }

  }, [newDisliked]);

  const setMenuConfig = (btn) => {

    switch (btn) {

      case 0:
        setBtn0Menu('col-span-1 py-3 outline-none focus:outline-none');
        setBtn1Menu('col-span-1 bg-preto/20 py-3');
        setBtn2Menu('col-span-1 bg-preto/20 py-3');
        setMenu(0);
        break;
      case 1:
        setBtn0Menu('col-span-1 bg-preto/20 py-3');
        setBtn1Menu('col-span-1 py-3 outline-none focus:outline-none');
        setBtn2Menu('col-span-1 bg-preto/20 py-3');
        setMenu(1);
        break;
      case 2:
        setBtn0Menu('col-span-1 bg-preto/20 py-3');
        setBtn1Menu('col-span-1 bg-preto/20 py-3');
        setBtn2Menu('col-span-1 py-3 outline-none focus:outline-none');
        setMenu(2);
        break;
      default:
        setBtn0Menu('col-span-1 py-3 outline-none focus:outline-none');
        setBtn1Menu('col-span-1 bg-preto/20 py-3');
        setBtn2Menu('col-span-1 bg-preto/20 py-3');
        setMenu(0);
        break;

    }

  }

  useEffect(() => {

    switch (reaction) {

      case 0:
        setThumbsDown('text-5xl mx-2 group text-rosa focus:outline-none outline-none');
        setThumbsUp('text-5xl mx-2 group text-cinza outline-none');
        break;
      case 1:
        setThumbsDown('text-5xl mx-2 group text-cinza');
        setThumbsUp('text-5xl mx-2 group text-amarelo focus:outline-none outline-none');
        break;
      default:
        setThumbsDown('text-5xl mx-2 group text-cinza');
        setThumbsUp('text-5xl mx-2 group text-cinza');
        break;

    }

  }, [reaction])

  const reactionEmme = async () => {

    if (reaction == 0) {

      addDoc(collection(db, `users/${auth.currentUser.uid}/dislikedEmmes`), {
        trackId: selectedEmmeId,
        track: selectedEmmeName,
        image: selectedEmmeImage,
        friendId: selectedEmmeFriendId,
        friendUsername: selectedEmmeFriendUsername,
        anon: false,
        message: selectedEmmeMessage,
        reactionEmme: reaction,
        date: selectedEmmeDate,
        createdAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/emmes`, selectedEmmeDocId));

      setNewDisliked(newDisliked + 1);

    } else if (reaction == 1) {

      addDoc(collection(db, `users/${auth.currentUser.uid}/likedEmmes`), {
        trackId: selectedEmmeId,
        track: selectedEmmeName,
        image: selectedEmmeImage,
        friendId: selectedEmmeFriendId,
        friendUsername: selectedEmmeFriendUsername,
        anon: false,
        message: selectedEmmeMessage,
        reactionEmme: reaction,
        date: selectedEmmeDate,
        createdAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/emmes`, selectedEmmeDocId));

      setNewLiked(newLiked + 1);

    }

    const createNotification = () => {

      const date = new Date();
      let dayParam = date.getDate();
      let monthParam = date.getMonth() + 1;
      let yearParam = date.getFullYear();

      let notificationTitleParam;
      let notificationBodyParam;

      if (reaction == 0) {
        notificationTitleParam = `@${selectedEmmeFriendUsername.toUpperCase()} DISLIKED YOUR EMME!`;
        notificationBodyParam = `Try finding out what @${selectedEmmeFriendUsername.toUpperCase()} is listening right now!`
      } else if (reaction == 1) {
        notificationTitleParam = `@${selectedEmmeFriendUsername.toUpperCase()} LIKED YOUR EMME!`;
        notificationBodyParam = `You definitely know @${selectedEmmeFriendUsername.toUpperCase()} music taste!`
      }

      let imageParam = selectedEmmeFriendImage;

      addDoc(collection(db, `users/${selectedEmmeFriendId}/notifications`), {
        notificationTitle: notificationTitleParam,
        notificationBody: notificationBodyParam,
        image: imageParam,
        friendId: selectedEmmeFriendId,
        friendUsername: "@" + selectedEmmeFriendUsername,
        friendName: selectedEmmeFriend,
        friendImage: selectedEmmeFriendImage,
        createdAt: serverTimestamp(),
        day: dayParam,
        month: monthParam,
        year: yearParam
      });

      const messageObject = {
        "to": selectedEmmeFriendFcm,
        "notification": {
          "title": notificationTitleParam,
          "body": notificationBodyParam,
        },
        "data": {
          'url': imageParam,
          "forId": selectedEmmeFriendId,
        }
      }

      sendNotificationToFCM(messageObject);

    }

    createNotification();

  }

  return (

    <>

      <div className={modal}>
        <div className='bg-preto w-[30vw] h-auto shadow-2xl flex flex-col items-center rounded-3xl px-5'>
          <button onClick={() => { setModal('hidden') }} className='text-5xl text-cinza w-full flex justify-end py-4'><CgClose /></button>
          <div className='flex flex-col justify-center w-full h-full items-center'>
            <div className='flex flex-col w-full items-center'>
              <img className='w-[13vw]' src={selectedEmmeImage} />
              <h1 className='text-white font-bold mt-2 text-2xl text-left'>{selectedEmmeName}</h1>
              <h2 className='text-white text-2xl text-left'>{selectedEmmeArtist}</h2>
            </div>
            <div className='h-full flex flex-col items-center justify-around py-10'>
              {/*<div>
                <h1 className='text-3xl text-cinza text-center'>SUGGESTED BY: {selectedEmmeFriend.toUpperCase()}</h1>
              </div>*/}
              <div className='flex items-center justify-center'>
                <button onClick={() => { setReaction(0); }} className={thumbsDown}><BsEmojiFrown /></button>
                <button onClick={() => { setReaction(1) }} className={thumbsUp}><BsEmojiSmile /></button>
              </div>
            </div>
          </div>
          <div className='flex justify-center w-full'>
            <button onClick={() => { reactionEmme(); setModal('hidden') }} type='button' className='py-2 px-5 mb-16 w-[10rem] rounded-full bg-amarelo text-xl text-preto outline-none'>ANSWER</button>
          </div>
        </div>
      </div>

      <section className='py-20'>

        <div className='bg-cinza mx-20 pb-20 flex flex-col'>

          <div className='grid grid-cols-3 text-preto text-2xl'>
            <button onClick={() => { setMenuConfig(0); }} className={btn0Menu}>NEW</button>
            <button onClick={() => { setMenuConfig(1); }} className={btn1Menu}>LIKED</button>
            <button onClick={() => { setMenuConfig(2); }} className={btn2Menu}>DISLIKED</button>
          </div>

          <div className='grid grid-cols-6 text-center pt-20'>
            <h1 className='col-start-1 col-span-1 text-amarelo text-2xl font-bold'>COVER</h1>
            <h1 className='col-start-2 col-span-1 text-amarelo text-2xl font-bold'>EMME</h1>
            <h1 className='col-start-3 col-span-1 text-amarelo text-2xl font-bold'>MESSAGE</h1>
            <h1 className='col-start-4 col-span-1 text-amarelo text-2xl font-bold'>SUGGESTED BY</h1>
            <h1 className='col-start-5 col-span-1 text-amarelo text-2xl flex justify-center'><HiClock /></h1>
            <h1 className='col-start-6 col-span-1 text-amarelo text-2xl font-bold'>REACTION</h1>
          </div>

          <div className='grid grid-cols-6 text-lg py-5'>
            {(documentos != [] && documentos != undefined && documentos != null && menu == 0) &&
              documentos.map((element, index) => (
                <div key={index} className='w-full h-[12rem] col-span-6 col-start-1 grid grid-cols-6 text-center items-center justify-center text-preto hover:font-semibold border-b border-preto group'>
                  <div className='col-start-1 col-span-1 text-center'><Link to="/album" state={{ id: element.albumId }}><img className='w-[9rem] h-[9rem] m-auto' src={element.image} /></Link></div>
                  <div className='col-start-2 col-span-1'><Link to="/album" state={{ id: element.trackId }}>{element.track}</Link></div>
                  <div className='col-start-3 col-span-1'>"{element.message.toUpperCase()}"</div>
                  <div className='col-start-4 col-span-1 flex justify-center'>{element.anon == false ? (<Link to="/user"  state={{ id: element.friendId }}>@{element.friendUsername.toUpperCase()}</Link>) : (<div className='text-3xl'><AiOutlineUser /></div>)}</div>
                  <div className='col-start-5 col-span-1'>{element.date}</div>
                  <div className='col-start-6 col-span-1'><button onClick={() => { setModal('h-screen w-screen  bg-black/60 z-[1000] flex fixed top-0 justify-center items-center'); setSelectedEmmeId(element.trackId); setSelectedEmmeDocId(docsId[index]); setSelectedEmmeName(element.track); setSelectedEmmeImage(element.image); setSelectedEmmeDate(element.date); setSelectedEmmeFriend(element.friendName); setSelectedEmmeFriendId(element.friendId); setSelectedEmmeMessage(element.message.toUpperCase()); setSelectedAlbumId(element.albumId); setSelectedEmmeFriendImage(element.friendImage); setSelectedEmmeFriendUsername(element.friendUsername); setSelectedEmmeFriendFcm(element.friendFcm) }} className='bg-amarelo/40 group-hover:bg-amarelo text-preto/40 group-hover:text-preto rounded-full py-2 px-6'>ANSWER</button></div>
                </div>
              ))

            }
            {(menu == 0 && documentos == '') &&
              <div className='flex w-full justify-center col-span-6 pt-28'>
                <h1 className='text-3xl text-preto w-full text-center'>NO NEW EMMES</h1>
              </div>
            }

            {(likedDocs != [] && likedDocs != undefined && likedDocs != null && menu == 1) &&
              likedDocs.map((element, index) => (
                <div key={index} className='w-full h-[12rem] col-span-6 col-start-1 grid grid-cols-6 text-center items-center justify-center text-preto hover:font-semibold border-b border-preto group'>
                  <div className='col-start-1 col-span-1 text-center'><img className='w-[9rem] h-[9rem] m-auto' src={element.image} /></div>
                  <div className='col-start-2 col-span-1'><Link to="/album" state={{ id: element.trackId }}>{element.track}</Link></div>
                  <div className='col-start-3 col-span-1'>"{element.message.toUpperCase()}"</div>
                  <div className='col-start-4 col-span-1'>{element.anon == false ? (<Link to="/user"  state={{ id: element.friendId }}>@{element.friendUsername.toUpperCase()}</Link>) : (<div><AiOutlineUser /></div>)}</div>
                  <div className='col-start-5 col-span-1'>{element.date}</div>
                  <div className='col-start-6 col-span-1 text-amarelo flex justify-center text-5xl'><BsEmojiSmile /></div>
                </div>
              ))
            }
            {(menu == 1 && likedDocsId == '') &&
              <div className='flex w-full justify-center col-span-6 pt-28'>
                <h1 className='text-2xl text-preto w-full text-center'>NO LIKED EMMES</h1>
              </div>
            }

            {(dislikedDocs != [] && menu == 2) &&
              dislikedDocs.map((element, index) => (
                <div key={index} className='w-full h-[12rem] col-span-6 col-start-1 grid grid-cols-6 text-center items-center justify-center text-preto hover:font-semibold border-b border-preto group'>
                  <div className='col-start-1 col-span-1 text-center'><img className='w-[9rem] h-[9rem] m-auto' src={element.image} /></div>
                  <div className='col-start-2 col-span-1'><Link to="/album" state={{ id: element.trackId }}>{element.track}</Link></div>
                  <div className='col-start-3 col-span-1'>"{element.message.toUpperCase()}"</div>
                  <div className='col-start-4 col-span-1'>{element.anon == false ? (<Link to="/user"  state={{ id: element.friendId }}>@{element.friendUsername.toUpperCase()}</Link>) : (<div><AiOutlineUser /></div>)}</div>
                  <div className='col-start-5 col-span-1'>{element.date}</div>
                  <div className='col-start-6 col-span-1 text-rosa flex justify-center text-5xl'><BsEmojiFrown /></div>
                </div>
              ))
            }
            {(menu == 2 && dislikedDocs == '') &&
              <div className='flex w-full justify-center col-span-6 pt-28'>
                <h1 className='text-2xl text-preto w-full text-center'>NO DISLIKED EMMES</h1>
              </div>
            }

          </div>
        </div>

      </section >

    </>
  )
}

export default Suggestions