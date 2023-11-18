import React, { useState, useEffect, useRef } from 'react';
import Imagem1 from '../../assets/gabriel.png';
import SetaBaixo from '../../assets/seta_baixo.png';
import { Link, useNavigate } from 'react-router-dom';
import { BsArrowUpRight } from 'react-icons/bs';
import { HiOutlineArrowDownRight } from 'react-icons/hi'
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaPlay, FaPause } from 'react-icons/fa';
import { RiShareCircleFill } from 'react-icons/ri';
import { MdExplicit } from 'react-icons/md';
import { CgClose } from 'react-icons/cg';
import { db, auth } from "../../firebase"
import { collection, addDoc, serverTimestamp, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { RxDotsHorizontal } from 'react-icons/rx';
import { TfiArrowTopLeft } from 'react-icons/tfi';
import { useAuthState } from 'react-firebase-hooks/auth';
import sendNotificationToFCM from '../utils/notifications';
import { MdRadioButtonUnchecked, MdRadioButtonChecked } from 'react-icons/md';

const Album_content = () => {

    const [currentUser, setCurrentUser] = useState('');
    const [albumImage, setAlbumImage] = useState('');
    const [albumName, setAlbumName] = useState('');
    const [artistName, setArtistName] = useState('');
    const [artistImage, setArtistImage] = useState('');
    const [artistId, setArtistId] = useState('');
    const [albumTracks, setAlbumTracks] = useState('');
    const [explicitTracks, setExplicitTracks] = useState('');
    const [trackPreviews, setTrackPreviews] = useState('');
    const [audio, setAudio] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [trackIndex, setTrackIndex] = useState(0);
    const audioRef = useRef(null);
    const [modal, setModal] = useState('hidden');
    const [modalSuccess, setModalSuccess] = useState('hidden');
    const [modalSuccess2, setModalSuccess2] = useState('hidden');
    const [modalOptions, setModalOptions] = useState('hidden');

    const [selectedTrackName, setSelectedTrackName] = useState('');
    const [selectedAlbumTrack, setSelectedAlbumTrack] = useState('');
    const [selectedTrackId, setSelectedTrackId] = useState('');
    const [favTrackName, setFavTrackName] = useState('');
    const [favAlbumTrackImage, setFavAlbumTrackImage] = useState('');
    const [favTrackId, setFavTrackId] = useState('');
    const [favTrackAlbum, setFavTrackAlbum] = useState('');
    const [favTrackExplicit, setFavTrackExplicit] = useState('');
    const [searchedUsersId, setSearchedUsersId] = useState('');
    const [searchedUsers, setSearchedUsers] = useState('');
    const [searchedUsersFcm, setSearchedUsersFcm] = useState('');
    const [searchedUsersUsername, setSearchedUsersUsername] = useState('');
    const [searchedUsersImage, setSearchedUsersImage] = useState('');
    const [inputUsers, setInputUsers] = useState('');
    const [hideInputUser, setHideInputUser] = useState('w-full bg-transparent border-b-2 border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none');
    const [searchedUsersDropdown, setSearchedUsersDropDown] = useState('bg-cinza');
    const [showSelectedUser, setShowSelectedUser] = useState('hidden');
    const [messageInput, setMessageInput] = useState('hidden');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUserFcm, setSelectedUserFcm] = useState('');
    const [selectedUserUsername, setSelectedUserUsername] = useState('');
    const [selectedUserImage, setSelectedUserImage] = useState('');
    const [message, setMessage] = useState('');
    const [btnAnon, setBtnAnon] = useState('hidden');
    const [anon, setAnon] = useState(false);
    const [userObject, setUserObject] = useState([]);
    const [user] = useAuthState(auth);

    const location = useLocation()
    const { id } = location.state;
    const navigate = useNavigate();
    console.log("AQUI ESTA O ID"+id)

    useEffect(() => {

        const unsub = auth.onAuthStateChanged((authObj) => {

            unsub();

            if (authObj) {

                const getUserId = async () => {
                    const userSearchId = await auth.currentUser.uid;
                    setCurrentUser(userSearchId);
                }

                getUserId();

            }

        });

    }, []);

    useEffect(() => {

        if (id != '' && id != undefined) {

            let token = localStorage.getItem("Bearer");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            const url = 'https://api.spotify.com/v1/albums/';

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
            };
            const fetchData = async () => {

                try {

                    await fetch(url + id, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            setAlbumImage(data.images[0].url);
                            setAlbumName(data.name);
                            setArtistName(data.artists[0].name);
                            setArtistId(data.artists[0].id);
                            setAlbumTracks(data.tracks.items);
                            var previewsArray = [];
                            var explicitarray = [];
                            data.tracks.items.forEach(element => {
                                previewsArray.push(element.preview_url);
                                explicitarray.push(element.explicit);
                            });
                            setExplicitTracks(explicitarray);
                            setTrackPreviews(previewsArray);
                        });

                } catch (error) {
                    console.log("error", error);
                }

            }

            fetchData();

        }

    }, [id]);

    useEffect(() => {

        if (artistId != '' && artistId != undefined) {

            let token = localStorage.getItem("Bearer");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            const url_2 = 'https://api.spotify.com/v1/artists/';

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            const fetchDataArtist = async () => {

                try {
                    await fetch(url_2 + artistId, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            setArtistImage(data.images[0].url);
                        });
                } catch (error) {
                    console.log("error", error);
                }
            }
            fetchDataArtist();
        }

    }, [artistId]);

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
            setModalOptions('absolute w-[14rem] flex flex-col justify-center items-center bg-preto text-cinza text-lg py-2 rounded-xl')
        } else {
            setModalOptions('hidden');
        }

    }

    const showModalSuccess2 = () => {

        setModalSuccess2('fixed h-screen w-screen top-0 left-0 flex justify-center items-center');
        setTimeout(() => { setModalSuccess2('hidden') }, 2500);

    }

    const addAlbumCaderneta = async () => {

        await addDoc(collection(db, `users/${currentUser}/albums`), {
            albumId: id,
            album: albumName,
            image: albumImage,
            type: "ALBUM",
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

    const showModalSuccess = () => {

        setModalSuccess('fixed h-screen w-screen top-0 left-0 flex justify-center items-center');
        setTimeout(() => { setModalSuccess('hidden') }, 2500);

    }

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

    return (
        <>

            <div className={modal}>
                <div className='bg-preto w-[40vw] h-[60vh] shadow-2xl flex flex-col justify-between items-center rounded-3xl px-5'>
                    <button onClick={() => { setModal('hidden'); setInputUsers(''); setSelectedUserId(''); setSelectedUser(''); setHideInputUser('w-full bg-transparent border-b-2 border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none'); setSearchedUsersDropDown('pt-2'); setShowSelectedUser('hidden'); setMessageInput('hidden'); setBtnAnon('hidden'); }} className='text-5xl text-cinza w-full flex justify-end py-4'><CgClose /></button>
                    <div className='flex flex-row justify-between w-full'>
                        <div className='flex flex-col w-full items-center'>
                            <img className='w-[13vw]' src={selectedAlbumTrack} />
                            <h1 className='text-white font-bold mt-2 text-2xl text-left'>{selectedTrackName}</h1>
                            <h2 className='text-white text-2xl text-left'>{artistName}</h2>
                        </div>
                        <div className='justify-start h-full w-full px-10 flex flex-col'>
                            <input onChange={(e) => { setInputUsers(e.target.value) }} className={hideInputUser} type="text" placeholder="Search for an user..." />
                            <div className={searchedUsersDropdown}>
                                {searchedUsers != '' &&
                                    searchedUsers.map((user, index) => (
                                        <button key={index} type='button' onClick={() => { setSelectedUserId(searchedUsersId[index]); setSelectedUser(user); setHideInputUser('hidden'); setSearchedUsersDropDown('hidden'); setShowSelectedUser('w-full flex items-center'); setMessageInput('w-full bg-transparent border-b-2 border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none'); setSelectedUserFcm(searchedUsersFcm[index]); setSelectedUserUsername(searchedUsersUsername[index]); setSelectedUserImage(searchedUsersImage[index]); setBtnAnon('w-full flex flex-col justify-center items-center pt-16'); }} className='w-full text-xl py-2 px-3 text-cinza border-b-2 border-preto flex items-center'><img className='w-[40px] h-[40px] object-cover rounded-full mr-3' src={searchedUsersImage[index]} />{user.toUpperCase()}</button>
                                    ))
                                }
                            </div>
                            <div className={showSelectedUser}>
                                {selectedUser != '' && <div className='flex items-center'><h1 className='text-cinza text-lg mr-2'>TO: </h1><img className='w-[40px] h-[40px] object-cover rounded-full mr-3' src={selectedUserImage} /><h1 className='text-cinza text-lg'>{selectedUser.toUpperCase()}</h1></div>}
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
                        <button type='button' onClick={() => { createNotification(); createEmme(); showModalSuccess(); setModal('hidden'); setInputUsers(''); setSelectedUserId(''); setSelectedUser(''); setHideInputUser('w-full bg-transparent border-b-2 border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none'); setSearchedUsersDropDown('pt-2'); setShowSelectedUser('hidden'); setMessageInput('hidden'); setBtnAnon('hidden'); setAnon(false) }} className='py-2 px-5 mb-16 w-[10rem] rounded-full bg-amarelo text-xl text-preto outline-none'>SEND EMME</button>
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

            <section className='pb-24'>

                <div className='flex flex-col justify-center items-center mt-20'>
                    <button className='text-6xl text-preto left-[125px] top-[125px] absolute' onClick={() => { navigate(-1) }}><TfiArrowTopLeft /></button>
                    <img src={albumImage} className="w-[500px] h-[500px] my-14" alt="Artist Profile Picture" />
                    <div className='group flex items-center'>
                        <h1 className='font-bold text-preto text-7xl '>{albumName != '' && albumName.toUpperCase()}</h1>
                        <button className='text-6xl hidden group-hover:block ml-5 pt-2' onClick={() => { modalOptionsFunction() }}><RxDotsHorizontal />
                            <div className={modalOptions}>
                                <button type='button' className='p-1' >SEND EMME</button>
                                <button type='button' className='p-1' onClick={() => { addAlbumCaderneta(); showModalSuccess2() }}>ADD TO BOOKLET</button>
                                <button type='button' className='p-1'>ADD TO CALENDAR</button>
                            </div>
                        </button>
                    </div>
                </div>

                <hr className='border b-2 border-b-preto my-14 mx-14'></hr>

                <div className='flex justify-between pl-36 pr-36 my-14'>
                    <h1 className=' px-7 py-5 text-preto text-5xl '>{artistName != '' && artistName.toUpperCase()}</h1>
                    <div className='mx-6 ml-auto flex'>
                        <Link to="/artist" state={{ id: artistId }} className="">
                            {artistImage != undefined &&
                                <img className="justify-start w-[100px] h-[100px] rounded-full " src={artistImage} />
                            }
                        </Link>
                        <img src={SetaBaixo} className="justify-end w-[60px] h-[60px] ml-5 mt-5" />
                    </div>

                </div>

                <div className='flex flex-col'>
                    <div className='grid grid-cols-9 pl-36 my-10 items-center justify-center'>
                        <div className='grid grid-cols-6 col-start-1 col-span-6'>
                            <div className='col-start-1 col-span-3 text-xl font-bold my-2 flex items-center pl-7 text-amarelo mb-20'> TRACKS</div>
                            <div className='col-start-4 col-span-3 text-xl font-bold my-2 flex justify-between text-amarelo mb-20 ml-32'> ARTISTS</div>

                            {albumTracks != "" &&
                                albumTracks.map((element, index) => (
                                    <div key={index} className='col-start-1 col-span-6 grid grid-cols-6 text-preto/50 hover:text-preto focus:text-preto text-left group'>
                                        <div className='col-start-1 col-span-3 text-xl font-bold my-2 flex items-center'><button className='w-[30px]' onClick={() => { audio == 0 ? playTrack(index) : pauseTrack() }}>{audio == 0 ? <FaPlay className='hidden group-hover:block focus:outline-0 w-[50%]' /> : <FaPause className='hidden group-hover:block focus:outline-0 w-[50%]' />}</button><h1 className='flex items-center'>{element.name.toUpperCase()} {explicitTracks[index] ? <MdExplicit className='ml-3 mt-1' /> : null}</h1></div>
                                        <div className='col-start-4 col-span-3 text-xl font-bold my-2 flex justify-between ml-32'>
                                            <h1 className='flex'>{element.artists[0].name.toUpperCase()}</h1>
                                            <button className='text-3xl hidden group-hover:block ml-5 pt-2' onClick={() => { modalOptionsFunction() }}><RxDotsHorizontal />
                                                <div className={modalOptions}>
                                                    <button type='button' className='w-full p-2 border-b-[1px] border-cinza hover:text-amarelo' onClick={() => { setModal('h-screen w-screen backdrop-blur-md bg-black/30 z-[1000] flex fixed top-0 justify-center items-center'); setSelectedAlbumTrack(albumImage); setSelectedTrackName(element.name.toUpperCase()); setSelectedTrackId(element.id) }}>SEND EMME</button>
                                                    <button type='button' className='w-full p-2 border-b-[1px] border-cinza hover:text-amarelo' onClick={() => { setFavTrackFunction(element.id, element.name, albumImage, albumName, explicitTracks[index]); showModalSuccess2(); createNotification(); }}>ADD TO BOOKLET</button>
                                                    <button type='button' className='p-2 hover:text-amarelo' onClick={() => { addToCalendar(element.id, element.name, albumImage, albumName, explicitTracks[index]); showModalSuccess(); }}>ADD TO CALENDAR</button>
                                                </div>
                                            </button>
                                        </div>

                                    </div>
                                ))
                            }

                            <audio ref={audioRef} controls={false} src={trackPreviews[trackIndex]} type="audio/mpeg"></audio>
                        </div>

                    </div>
                </div>

            </section>
        </>
    )
}

export default Album_content