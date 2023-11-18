import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import SearchIcon from '../../../assets/SearchIcon.svg';
import { CiPlay1, CiSearch } from 'react-icons/ci';
import { AiOutlinePause } from 'react-icons/ai';
import { RxDotsHorizontal } from 'react-icons/rx';
import { MdExplicit } from 'react-icons/md';
import Fade from '../../Transitions/fade'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { db, auth } from '../../../firebase';
import { collection, getDocs, limit, query, orderBy, getDoc, doc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { MdRadioButtonUnchecked, MdRadioButtonChecked } from 'react-icons/md';
import { CgClose } from 'react-icons/cg';
import sendNotificationToFCM from '../../utils/notifications';

const Carousel = () => {

    const [user, setUser] = useState('')
    const [albums, setAlbums] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [trackPreviews, setTrackPreviews] = useState('');
    const [trackIndex, setTrackIndex] = useState(0);
    const [audio, setAudio] = useState(0);
    const [reference, setReference] = useState('');
    const [topic, setTopic] = useState('')
    const [typeSearch, setTypeSearch] = useState('');
    const [idAlbuns, setIdAlbuns] = useState('');
    const [idArtists, setIdArtists] = useState('');
    const [modalOptions, setModalOptions] = useState('hidden');

    const [artistName, setArtistName] = useState('');
    const [modal, setModal] = useState('hidden');
    const [selectedTrackName, setSelectedTrackName] = useState('');
    const [selectedAlbumTrack, setSelectedAlbumTrack] = useState('');
    const [selectedAlbumId, setSelectedAlbumId] = useState('');
    const [selectedTrackId, setSelectedTrackId] = useState('');
    const [favTrackName, setFavTrackName] = useState('');
    const [favAlbumTrackImage, setFavAlbumTrackImage] = useState('');
    const [favTrackId, setFavTrackId] = useState('');
    const [favTrackAlbum, setFavTrackAlbum] = useState('');
    const [favTrackExplicit, setFavTrackExplicit] = useState('');
    const [favArtistName, setFavArtistName] = useState('');
    const [favArtistImage, setFavArtistImage] = useState('');
    const [favArtistId, setFavArtistId] = useState('');
    const [searchedUsersId, setSearchedUsersId] = useState('');
    const [searchedUsers, setSearchedUsers] = useState('');
    const [searchedUsersFcm, setSearchedUsersFcm] = useState('');
    const [searchedUsersUsername, setSearchedUsersUsername] = useState('');
    const [searchedUsersImage, setSearchedUsersImage] = useState('');
    const [inputUsers, setInputUsers] = useState('');
    const [hideInputUser, setHideInputUser] = useState('w-full bg-transparent border-b-2 border-cinza placeholder:text-cinza/70 text-cinza p-1 focus:outline-none');
    const [searchedUsersDropdown, setSearchedUsersDropDown] = useState('pt-2');
    const [showSelectedUser, setShowSelectedUser] = useState('hidden');
    const [messageInput, setMessageInput] = useState('hidden');
    const [modalSuccess, setModalSuccess] = useState('hidden');
    const [modalSuccess2, setModalSuccess2] = useState('hidden');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUserFcm, setSelectedUserFcm] = useState('');
    const [selectedUserUsername, setSelectedUserUsername] = useState('');
    const [selectedUserImage, setSelectedUserImage] = useState('');
    const [message, setMessage] = useState('');
    const [btnAnon, setBtnAnon] = useState('hidden');
    const [anon, setAnon] = useState(false);
    const [userObject, setUserObject] = useState([]);

    const audioRef = useRef(null);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const getUserId = () => {
                    const userSearchId = auth.currentUser.uid;
                    setUser(userSearchId);
                }
                getUserId();
                getUserCalendar();
            }
        });
    }, []);

    const getUserCalendar = async () => {

        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        const userLoggedInfoCalendar = await getDocs(query(collection(db, `users/${auth.currentUser.uid}/calendar`), orderBy("createdAt", "desc")));

        if (!userLoggedInfoCalendar.empty) {

            setReference(userLoggedInfoCalendar.docs[0].data().trackId);
            setTypeSearch(0)

        } else {

            const userLoggedInfoTracks = await getDocs(query(collection(db, `users/${auth.currentUser.uid}/tracks`), orderBy("createdAt", "desc")));

            if (!userLoggedInfoTracks.empty) {

                setReference(userLoggedInfoTracks.docs[0].data().trackId);
                setTypeSearch(1);

            } else {

                let token = localStorage.getItem("Bearer");
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + token);
                myHeaders.append("Content-Type", "application/json");

                const url = `https://api.spotify.com/v1/playlists/5LjMoUjVPKDZyaSj5ynLWA/tracks`;
                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const fetchData = async () => {

                    try {
                        await fetch(url, requestOptions)
                            .then(response => response.json())
                            .then(data => {
                                let previewsArray = [];
                                let idAlbunsArray = [];
                                let idArtistsArray = [];
                                setTopic("EMME'S PUBLIC PLAYLIST");
                                console.log(data);
                                setTypeSearch(2);
                                setAlbums(data.items);
                                data.items.forEach(element => {
                                    previewsArray.push(element.track.preview_url);
                                    idAlbunsArray.push(element.track.album.id)
                                    idArtistsArray.push(element.track.artists[0].id)
                                });
                                setTrackPreviews(previewsArray);
                                setIdAlbuns(idAlbunsArray);
                                setIdArtists(idArtistsArray);
                            });
                    } catch (error) {
                        console.log("error", error);
                    }

                }

                fetchData();

            }

        }
    }

    useEffect(() => {

        const getTrackRec = async () => {

            if (reference != "") {

                let token = localStorage.getItem("Bearer");
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + token);
                myHeaders.append("Content-Type", "application/json");

                const url = `https://api.spotify.com/v1/recommendations?seed_tracks=${reference}&limit=40`;
                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const fetchData = async () => {

                    try {
                        await fetch(url, requestOptions)
                            .then(response => response.json())
                            .then(data => {
                                let previewsArray = [];
                                let idAlbunsArray = [];
                                let idArtistsArray = [];
                                console.log(data)
                                setAlbums(data.tracks);
                                checkTopic(data.tracks[0].artists[0].id);
                                data.tracks.forEach(element => {
                                    previewsArray.push(element.preview_url);
                                    idAlbunsArray.push(element.album.id);
                                    idArtistsArray.push(element.artists[0].id)
                                });
                                setTrackPreviews(previewsArray);
                                setIdAlbuns(idAlbunsArray);
                                setIdArtists(idArtistsArray);
                            });
                    } catch (error) {
                        console.log("error", error);
                    }

                }

                fetchData();

            }

        }

        getTrackRec();

    }, [reference]);

    const addToCalendar = async (trackIdParam, trackParam, imageParam, albumParam, explicitParam) => {

        var dt = new Date();

        var dayParam = dt.getDate();
        var monthParam = dt.getMonth();
        var yearParam = dt.getFullYear();

        const calendarRef = collection(db, `users/${auth.currentUser.uid}/calendar`);
        const entries = await getDocs(query(calendarRef, where("day", "==", dayParam), where("month", "==", monthParam), where("year", "==", yearParam)));
        if (entries.empty) {

            addDoc(collection(db, `users/${auth.currentUser.uid}/calendar`), {
                trackId: trackIdParam,
                track: trackParam,
                image: imageParam,
                album: albumParam,
                explicit: explicitParam,
                day: dayParam,
                month: monthParam,
                year: yearParam,
                createdAt: serverTimestamp(),
            });

        }

    }

    const showModalSuccess = () => {

        setModalSuccess('fixed h-screen w-screen top-0 left-0 flex justify-center items-center');
        setTimeout(() => { setModalSuccess('hidden') }, 2500);

    }

    const showModalSuccess2 = () => {

        setModalSuccess2('fixed h-screen w-screen top-0 left-0 flex justify-center items-center');
        setTimeout(() => { setModalSuccess2('hidden') }, 2500);

    }

    const checkTopic = async (idArtist) => {

        let token = localStorage.getItem("Bearer");
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        const url = `https://api.spotify.com/v1/artists/${idArtist}`;
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        const fetchData = async () => {

            try {
                await fetch(url, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        setTopic(data.genres[0].toUpperCase());
                    });
            } catch (error) {
                console.log("error", error);
            }

        }

        fetchData();

    }

    const imagesArray = [];

    useEffect(() => {

        if (typeSearch == 0) {

            albums.forEach(element => {
                imagesArray.push(element.album.images[0].url);
            })

        } else if (typeSearch == 1) {

            albums.forEach(element => {
                imagesArray.push(element.album.images[0].url);
            })

        } else if (typeSearch == 2) {

            albums.forEach(element => {
                imagesArray.push(element.track.album.images[0].url);
            })

        }

        setImages(imagesArray)

        console.log(typeSearch)

    }, [albums]);

    function playTrack(index) {
        setAudio(1);
        setTrackIndex(index);
        audioRef.current.play();
    }

    function pauseTrack() {
        setAudio(0);
        audioRef.current.pause();
    }

    const modalOptionsFunction = () => {

        if (modalOptions == 'hidden') {
            setModalOptions('absolute w-[14rem] flex flex-col justify-center items-center bg-preto text-cinza text-lg py-2 rounded-xl bottom-0 -right-[14rem]')
        } else {
            setModalOptions('hidden');
        }

    }

    const createEmme = async () => {

        const date = new Date();

        var dayParam = date.getDate();
        var monthParam = date.getMonth() + 1;
        var yearParam = date.getFullYear()

        var dateToSave = `${dayParam}/${monthParam}/${yearParam}`;

        const userLoggedInfo = await getDoc(doc(db, 'users', auth.currentUser.uid));

        addDoc(collection(db, `users/${selectedUserId}/emmes`), {
            trackId: selectedTrackId,
            track: selectedTrackName,
            albumId: selectedAlbumId,
            image: selectedAlbumTrack,
            type: "TRACK",
            friendId: auth.currentUser.uid,
            friendName: userLoggedInfo.data().name,
            friendUsername: userLoggedInfo.data().username,
            friendImage: userLoggedInfo.data().photoUrl,
            friendFcm: userLoggedInfo.data().fcm,
            anon: anon,
            message: message,
            date: dateToSave,
            createdAt: serverTimestamp(),
        });

    }

    const setFavTrackFunction = async (idParam, trackNameParam, trackAlbumImgParam, trackAlbumNameParam, explicit) => {

        setFavTrackId(idParam);
        setFavTrackName(trackNameParam);
        setFavAlbumTrackImage(trackAlbumImgParam);
        setFavTrackAlbum(trackAlbumNameParam);
        setFavTrackExplicit(explicit);

        await addTrackCaderneta(idParam, trackNameParam, trackAlbumImgParam, trackAlbumNameParam, explicit);

    }

    const addTrackCaderneta = async (idParam, trackNameParam, trackAlbumImgParam, trackAlbumNameParam, explicit) => {

        addDoc(collection(db, `users/${auth.currentUser.uid}/tracks`), {
            trackId: idParam,
            track: trackNameParam,
            image: trackAlbumImgParam,
            album: trackAlbumNameParam,
            explicit: explicit,
            type: "TRACK",
            createdAt: serverTimestamp(),
        });

    }   

    const createNotification = () => {

        const date = new Date();
        let dayParam = date.getDate();
        let monthParam = date.getMonth() + 1;
        let yearParam = date.getFullYear();

        let notificationTitleParam = `NEW EMME FROM @${selectedUserUsername.toUpperCase()}!`;
        let imageParam = selectedUserImage;

        if (anon == true) {
            imageParam = "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg";
            notificationTitleParam = `SOMEBODY SENT YOU A NEW EMME!`;
            setSelectedUser("Anonymous");
            setSelectedUserUsername("anon");
        }

        addDoc(collection(db, `users/${selectedUserId}/notifications`), {
            notificationTitle: notificationTitleParam,
            notificationBody: message,
            image: imageParam,
            friendId: (anon == true ? auth.currentUser.uid : selectedUserId),
            friendName: (anon == true ? "Anonymous" : selectedUser),
            friendUsername: (anon == true ? "@anon" : `@${selectedUserUsername}`),
            createdAt: serverTimestamp(),
            anon: anon,
            day: dayParam,
            month: monthParam,
            year: yearParam
        });

        const messageObject = {
            "to": selectedUserFcm,
            "notification": {
                "title": notificationTitleParam,
                "body": message,
            },
            "data": {
                'url': imageParam,
                "forId": selectedUserId,
            }
        }

        sendNotificationToFCM(messageObject);

    }

    useEffect(() => {

        if (inputUsers != '') {

            const searchUsers = async () => {

                var searchedUsersNameArray = [];
                var searchedUsersIdArray = [];
                var searchedUsersFcmArray = [];
                var searchedUsersUsernameArray = [];
                var searchedUsersImageArray = [];

                var usersRef = collection(db, "users");

                const q = query(usersRef, where("name", ">=", inputUsers), where("name", "<=", inputUsers + "\uf7ff"));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ",", doc.data())
                    searchedUsersNameArray.push(doc.data().name);
                    searchedUsersFcmArray.push(doc.data().fcm);
                    searchedUsersIdArray.push(doc.id);
                    searchedUsersUsernameArray.push(doc.data().username);
                    searchedUsersImageArray.push(doc.data().photoUrl);
                });

                setSearchedUsersId(searchedUsersIdArray);
                setSearchedUsers(searchedUsersNameArray);
                setSearchedUsersFcm(searchedUsersFcmArray);
                setSearchedUsersUsername(searchedUsersUsernameArray);
                setSearchedUsersImage(searchedUsersImageArray);

            }

            searchUsers();

        } else {

            setSearchedUsersId('');
            setSearchedUsers('');
            setSearchedUsersFcm('');
            setSearchedUsersUsername('');
            setSearchedUsersImage('');

        }

    }, [inputUsers]);

    const settings = {
        infinite: true,
        speed: 200,
        touchMove: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        afterChange: current => setCurrentIndex(current),
        className: 'center',
        centerMode: true,
        initialSlide: 0,
        draggable: true,
        focusOnSelect: true,
        easing: true,
        centerPadding: '100px'
    };

    return (

        <>

            <div className={modal}>
                <div className='bg-preto w-auto h-auto shadow-2xl flex flex-col justify-between items-center rounded-3xl px-5'>
                    <button onClick={() => { setModal('hidden'); setInputUsers(''); setSelectedUserId(''); setSelectedUser(''); setHideInputUser('w-full bg-transparent border-b-2 border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none'); setSearchedUsersDropDown('pt-2'); setShowSelectedUser('hidden'); setMessageInput('hidden'); setBtnAnon('hidden'); }} className='text-5xl text-cinza w-full flex justify-end py-4'><CgClose /></button>
                    <div className='flex flex-row justify-between w-full'>
                        <div className='flex flex-col items-center ml-8'>
                            <img className='w-[20vw]' src={selectedAlbumTrack} />
                            <div className="fade-in-child w-full justify-between items-center">
                                <h1 className='text-white w-[20vw] font-bold mt-2 text-lg '>{selectedTrackName}</h1>
                                <h2 className='text-white text-lg'>{artistName}</h2>
                            </div>
                        
                        </div>
                        <div className='justify-start h-full  px-14 flex flex-col w-[28vw]'>
                            <input onChange={(e) => { setInputUsers(e.target.value) }} className={hideInputUser} type="text" placeholder="SEARCH FOR AN USER" />
                            <div className={searchedUsersDropdown}>
                                {searchedUsers != '' &&
                                    searchedUsers.map((user, index) => (    
                                        <button key={index} type='button' onClick={() => { setSelectedUserId(searchedUsersId[index]); setSelectedUser(user); setHideInputUser('hidden'); setSearchedUsersDropDown('hidden'); setShowSelectedUser('w-full flex items-center'); setMessageInput('w-full bg-transparent border-b-2 border-cinza placeholder:text-amarelo/70 text-amarelo p-1 focus:outline-none'); setSelectedUserFcm(searchedUsersFcm[index]); setSelectedUserUsername(searchedUsersUsername[index]); setSelectedUserImage(searchedUsersImage[index]); setBtnAnon('w-full flex flex-col justify-center items-center pt-12'); }} className='w-full text-lg py-2 px-3 text-cinza border-b-2 border-preto flex items-center'><img className='w-[40px] h-[40px] object-cover rounded-full mr-3' src={searchedUsersImage[index]} />{user.toUpperCase()}</button>
                                    ))
                                }
                            </div>
                            <div className={showSelectedUser}>
                                {selectedUser != '' && <div className='flex items-center'><h1 className='text-amarelo text-lg mr-2'>TO: </h1><img className='w-[40px] h-[40px] object-cover rounded-full mr-3' src={selectedUserImage} /><h1 className='text-cinza text-lg'>{selectedUser.toUpperCase()}</h1></div>}
                            </div>
                            <div className={btnAnon}>
                                <input onChange={(e) => { setMessage(e.target.value) }} type="text" className={messageInput} placeholder="WRITE YOUR MESSAGE..." />
                                <div className='w-full flex pt-2'>
                                    <button onClick={() => { setAnon(!anon) }} className="text-cinza text-2xl mr-2 text-left">{anon == false ? <MdRadioButtonUnchecked /> : <MdRadioButtonChecked />}</button>
                                    <h1 className='text-cinza text-lg'>SEND ANONYMOUSLY</h1>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='flex justify-center w-full'>
                        <button type='button' onClick={() => { createNotification(); createEmme(); setModal('hidden'); setInputUsers(''); setSelectedUserId(''); setSelectedUser(''); setHideInputUser('w-full bg-transparent border-b-2 border-cinza placeholder:text-cinza/70 text-cinza p-1 focus:outline-none'); setSearchedUsersDropDown('pt-2'); setShowSelectedUser('hidden'); setMessageInput('hidden'); setBtnAnon('hidden'); setAnon(false);  showModalSuccess() }} className='py-2 px-5 mb-16 w-[11rem] rounded-full bg-amarelo text-xl text-preto outline-none mt-6 hover:bg-amarelo_escuro'>SEND EMME</button>
                    </div>
                </div>
            </div>

            <div className={modalSuccess}>
                <div className='absolute w-[10vw] h-[5vh] bg-amarelo font-bold text-lg text-preto bottom-20 rounded-2xl flex justify-center items-center'>
                    <h1>EMME SENT</h1>
                </div>
            </div>
            
            <div className={modalSuccess2}>
                <div className='absolute w-[13vw] h-[5vh] bg-amarelo font-bold text-lg text-preto bottom-20 rounded-2xl flex justify-center items-center'>
                    <h1>ADDED TO BOOKLET</h1>
                </div>
            </div>

            <section className="overflow-hidden h-full flex flex-col justify-center items-center pt-8 pb-12">
                <div className="flex justify-between w-full px-20 pb-8">
                    <div className="flex items-center">
                        <span className="bg-amarelo rounded-full w-[20px] h-[20px]"></span>
                        <h1 className="font-bold text-xl mx-3">TODAY'S EMME</h1>
                        <h1 className="text-xl">{topic}</h1>
                    </div>
                    <div>
                        <Link to="/search" className="text-4xl hover:text-rosa text-preto"><CiSearch /></Link>
                    </div>
                </div>
                <Slider {...settings} className="w-[150vw] group">
                    {images.map((image, index) => (
                        (index == currentIndex ?
                            <div className="flex flex-col">
                                <img key={index} src={image} alt="album" className="" />
                                <div className="fade-in-child ease-in-out transition-all w-full group-hover:flex group-hover:fade-in-custom flex-col hidden text-preto pl-2 pr-2 pt-2 pb-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Link to="/album" state={{ id: idAlbuns[index] }} className="text-lg font-semibold flex items-center">{typeSearch == 2 ? albums[index].track.name.toUpperCase() : albums[index].name.toUpperCase()} {typeSearch == 2 ? (albums[index].track.explicit ? <MdExplicit /> : null) : (albums[index].explicit ? <MdExplicit /> : null)}</Link>
                                            <Link to="/artist" state={{ id: idArtists[index] }} className="text-base">{typeSearch == 2 ? albums[index].track.artists[0].name.toUpperCase() : albums[index].artists[0].name.toUpperCase()}</Link>
                                        </div>
                                        <div>
                                            <button onClick={() => { modalOptionsFunction() }} className="text-3xl"><RxDotsHorizontal />
                                                <div className={modalOptions}>
                                                    <button type='button' className='w-full p-2 border-b-[1px] border-cinza hover:text-amarelo' onClick={() => { setModal('h-screen w-screen backdrop-blur-md bg-black/30 z-[1000] flex fixed top-0 justify-center items-center'); setSelectedAlbumTrack(image); setSelectedTrackName(typeSearch == 2 ? albums[index].track.name.toUpperCase() : albums[index].name.toUpperCase()); setSelectedTrackId(typeSearch == 2 ? albums[index].track.id : albums[index].id);  setSelectedAlbumId(typeSearch == 2 ? albums[index].id : albums[index].id) }}>SEND EMME</button>
                                                    <button type='button' className='w-full p-2 border-b-[1px] border-cinza hover:text-amarelo' onClick={() => { setFavTrackFunction((typeSearch == 2 ? albums[index].track.id : albums[index].id), (typeSearch == 2 ? albums[index].track.name.toUpperCase() : albums[index].name.toUpperCase()), image, (typeSearch == 2 ? albums[index].track.album.name.toUpperCase() : albums[index].album.name.toUpperCase()), (typeSearch == 2 ? albums[index].track.explicit : albums[index].explicit)); showModalSuccess2(); createNotification(); }}>ADD TO BOOKLET</button>
                                                    <button type='button' className='p-2 hover:text-amarelo' onClick={() => { addToCalendar((typeSearch == 2 ? albums[index].track.id : albums[index].id), (typeSearch == 2 ? albums[index].track.name.toUpperCase() : albums[index].name.toUpperCase()), image, (typeSearch == 2 ? albums[index].track.album.name.toUpperCase() : albums[index].album.name.toUpperCase()), (typeSearch == 2 ? albums[index].track.explicit : albums[index].explicit)); showModalSuccess()}}>ADD TO CALENDAR</button>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button onClick={() => { audio == 0 ? playTrack(index) : pauseTrack() }} className="text-preto text-6xl">{audio == 0 ? <CiPlay1 className='hidden group-hover:block focus:outline-0 w-[50%]' /> : <AiOutlinePause className='hidden group-hover:block focus:outline-0 w-[50%]' />}</button>
                                    </div>
                                    <audio ref={audioRef} controls={false} src={trackPreviews[trackIndex]} type="audio/mpeg"></audio>
                                </div>
                            </div> :
                            (index == (currentIndex + 1) || index == (currentIndex + images.length - images.length - 1) || (index == images.length - 1 && currentIndex == 0) ?
                                <img key={index} src={image} alt="album" className="opacity-60 p-10 ease-in-out duration-200" /> :
                                <img key={index} src={image} alt="album" className="opacity-60 p-20 ease-in-out duration-200" />))
                    ))}
                </Slider>
            </section >
        </>
    );
}

export default Carousel
