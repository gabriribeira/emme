import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { doc, getDoc, getDocs, collection, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../firebase';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdExplicit } from 'react-icons/md';
import CalendarUser from "./CalendarUser";
import {
    addDoc, serverTimestamp,

} from "firebase/firestore";;

const Profile = () => {
    const [botao0, setBotao0] = useState("text-xl w-1/3 pb-5 border-b-2 border-preto text-preto");
    const [botao1, setBotao1] = useState("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");
    const [botao2, setBotao2] = useState("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");

    const [user, setUser] = useState("");
    const [id, setUserId] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [descricao, setDescricao] = useState("");
    const [image, setImage] = useState("");
    const [position, setPosition] = useState(0);
    const [trackIndex, setTrackIndex] = useState(0);
    const [audio, setAudio] = useState(0);
    const [hoverTrack, setHoverTrack] = useState('');
    const [explicitTracks, setExplicitTracks] = useState('');
    const [followButton, setFollowButton] = useState('mr-2 py-2 px-1 w-[10rem] rounded-full bg-amarelo text-2xl text-preto outline-none hover:bg-amarelo_escuro');
    const [unfollowButton, setUnFollowButton] = useState('mr-2 py-2 px-2 w-[10rem] rounded-full bg-preto text-2xl text-amarelo outline-none hover:bg-black');
    const [buttonStyle, setButtonStyle] = useState('');
    const [buttonWord, setButtonWord] = useState('FOLLOW');
    const [userLog, setUserLog] = useState("");
    const [positionMAJOR, setPositionMAJOR] = useState("");
    const [followers, setFollowers] = useState("");
    const [following, setFollowing] = useState("");

    const navigate = useNavigate();

    const [docsArtists, setDocsArtists] = useState();
    const [docsIdArtists, setDocsIdArtists] = useState('');
    var docsArrayArtists = [];
    var docsIdArrayArtists = [];

    const [docsAlbums, setDocsAlbums] = useState();
    const [docsIdAlbums, setDocsIdAlbums] = useState('');
    var docsArrayAlbums = [];
    var docsIdArrayAlbums = [];

    const [docsT, setDocsTId] = useState();
    const [docsTracks, setDocsTracks] = useState();
    const [docsTracksId, setDocsTracksId] = useState('');
    const [docsTracksImage, setDocsTracksImage] = useState('');
    const [selectedTrackId, setSelectedTrackId] = useState('');
    const [trackAlbum, setTrackAlbum] = useState('');
    const [follwersIdDocs, setFollowersIdDocs] = useState('')
    const [followingIdDocs, setFollowingIdDocs] = useState('');

    const [currentName, setCurrentName] = useState('');
    const [currentImage, setCurrentImage] = useState('');

    const location = useLocation()
    const { iduser } = location.state;
    const audioRef = useRef(null);

    var userSearchId;

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {

                const getUserLogId = async () => {
                    userSearchId = await auth.currentUser.uid;
                    setUserLog(userSearchId);
                }
                getUserLogId();
                getUserInfo();
            }
        });

    }, []);

    const getUserInfo = async () => {

        const currentUserInfo = await getDoc(doc(db, `users/${auth.currentUser.uid}`));
        const datacurrent = currentUserInfo.data()
        setCurrentName(datacurrent.name)
        setCurrentImage(datacurrent.photoUrl)

        const userInfo = await getDoc(doc(db, `users/${iduser}`));
        const data = userInfo.data()
        setUser(userInfo.data());
        setName(data.name)
        setUserId(data.id)
        setUsername(data.username)
        setDescricao(data.description)
        setEmail(data.email)
        setImage(data.photoUrl)

        const caderneta_artists = await getDocs(collection(db, `users/${iduser}/artists`));
        caderneta_artists.forEach((doc) => {
            docsArrayArtists.push(doc.data());
            docsIdArrayArtists.push(doc.data().artistId);
        });

        setDocsArtists(docsArrayArtists);
        setDocsIdArtists(docsIdArrayArtists);

        const caderneta_albums = await getDocs(collection(db, `users/${iduser}/albums`));
        caderneta_albums.forEach((doc) => {
            docsArrayAlbums.push(doc.data());
            docsIdArrayAlbums.push(doc.data().albumId);
        });

        setDocsAlbums(docsArrayAlbums);
        setDocsIdAlbums(docsIdArrayAlbums);

        const caderneta_tracks = await getDocs(collection(db, `users/${iduser}/tracks`));
        if (caderneta_tracks != '' && caderneta_tracks != undefined && caderneta_tracks != null) {
            var docsArrayTId = [];
            var docsArrayTracks = [];
            var docsArrayTracksId = [];
            var docsArrayTracksImage = [];
            var docsArrayTracksAlbum = [];
            var explicitarray = [];

            caderneta_tracks.forEach((doc) => {
                docsArrayTId.push(doc.id)
                docsArrayTracks.push(doc.data().track);
                docsArrayTracksId.push(doc.data().trackId);
                docsArrayTracksImage.push(doc.data().image);
                docsArrayTracksAlbum.push(doc.data().album);
                explicitarray.push(doc.data().explicit);
            });

            setDocsTId(docsArrayTId);
            setDocsTracks(docsArrayTracks);
            setDocsTracksId(docsArrayTracksId);
            setDocsTracksImage(docsArrayTracksImage);
            setTrackAlbum(docsArrayTracksAlbum);
            setExplicitTracks(explicitarray);

        }

        const USERfollowers = await getDocs(collection(db, `users/${iduser}/followers`));
        var docsFollowers = [];
        var docsIdFollowers = [];
        USERfollowers.forEach((doc) => {
            docsFollowers.push(doc.data().id)
            docsIdFollowers.push(doc.id)
        });

        setFollowers(docsFollowers);
        setFollowersIdDocs(docsIdFollowers)

        const USERfollowing = await getDocs(collection(db, `users/${iduser}/following`));
        var docsFollowing = [];
        var docsIdFollowing = [];
        USERfollowing.forEach((doc) => {
            docsFollowing.push(doc.data().id);
            docsIdFollowing.push(doc.id)
        });

        setFollowing(docsFollowing);
        setFollowingIdDocs(docsIdFollowing)

        checkIffollows();

    }


    const checkIffollows = async () => {

        const docRef = await getDocs(query(collection(db, `users/${iduser}/followers`), where("id", "==", auth.currentUser.uid)))

        if (docRef.docs[0]) {
            setButtonStyle('mr-2 py-2 px-2 w-[10rem] rounded-full bg-preto text-2xl text-amarelo outline-none hover:bg-black');
            setButtonWord('UNFOLLOW')
        } else {
            setButtonStyle('mr-2 py-2 px-1 w-[10rem] rounded-full bg-amarelo text-2xl text-preto outline-none hover:bg-amarelo_escuro');
            setButtonWord('FOLLOW')
        }

    }

    const follow = async () => {
        setButtonWord("UNFOLLOW")
        setButtonStyle('mr-2 py-2 px-2 w-[10rem] rounded-full bg-preto text-2xl text-amarelo outline-none hover:bg-black');
        const userLoggedInfo = await getDoc(doc(db, 'users', auth.currentUser.uid));
        addDoc(collection(db, `users/${auth.currentUser.uid}/following`), {
            id: iduser,
            name: name,
            photoUrl: image,
            createdAt: serverTimestamp(),
        });

        addDoc(collection(db, `users/${iduser}/followers`), {
            id: auth.currentUser.uid,
            name: currentName,
            photoUrl: currentImage,
            createdAt: serverTimestamp(),
        });

    }

    const unfollow = async () => {

        console.log(1)

        setButtonWord("FOLLOW");
        setButtonStyle('mr-2 py-2 px-1 w-[10rem] rounded-full bg-amarelo text-2xl text-preto outline-none hover:bg-amarelo_escuro');

        const docRef = await getDocs(query(collection(db, `users/${iduser}/followers`), where("id", "==", auth.currentUser.uid)));

        console.log(docRef.docs[0].id)

        await deleteDoc(doc(db, `users/${iduser}/followers`, docRef.docs[0].id));

        const docRefcurrent = await getDocs(query(collection(db, `users/${auth.currentUser.uid}/following`), where("id", "==", iduser)));

        console.log(docRefcurrent.docs[0].id)

        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/following`, docRefcurrent.docs[0].id));

    }

    const handleClick = (index) => {

        setPosition(index);

        switch (index) {

            case 0:

                setBotao0("text-xl w-1/3 pb-5 border-b-2 border-preto text-preto");

                setBotao1("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");
                setBotao2("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");

                break;

            case 1:

                setBotao1("text-xl w-1/3 pb-5 border-b-2 border-preto text-preto");

                setBotao0("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");
                setBotao2("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");

                break;

            case 2:

                setBotao2("text-xl w-1/3 pb-5 border-b-2 border-preto text-preto");

                setBotao0("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");
                setBotao1("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");

                break;

            default:

                setBotao0("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");
                setBotao1("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");
                setBotao2("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");

                break;

        }

    }

    function playTrack(index) {
        setAudio(1);
        setTrackIndex(index);
        audioRef.current.play();

    }

    function pauseTrack() {
        setAudio(0);
        audioRef.current.pause();

    }

    return (

        <>

            <section className='h-full  flex flex-col'>
                <div className="h-screen ">
                    <div className="items-center justify-center grid grid-cols-2 absolute top-0 h-screen mt-8">
                        <div className="flex items-center justify-center z-10 w-[50vw] p-4 flex-colcol-start-1 col-span-1">
                            <div className="">
                                <img src={image} className="rounded-full w-[32rem] h-[32rem] object-cover"></img>
                            </div>
                        </div>
                        <div className="w-[50vw] p-4 pt-0 items-center flex-col justify-center col-start-2 col-span-1 border border-preto">
                            <div className="block ">

                                <h5 className="text-preto text-7xl  p-7">{name}</h5>
                                <div className="flex items-center p-7 pt-0">

                                    <button type='button' onClick={() => { { buttonWord === "FOLLOW" ? follow() : unfollow(); } }} className={buttonStyle}>{buttonWord}</button>
                                    <Link to="/friends" state={{ iduser: iduser, from: "followers" }}><h1 className="text-xl  mx-3 hover:text-amarelo">{followers.length} FOLLOWERS</h1></Link>
                                    <span className="bg-amarelo rounded-full w-[14px] h-[14px]"></span>
                                    <Link to="/friends" state={{ iduser: iduser, from: "following" }}><h1 className="text-xl  mx-3 hover:text-amarelo">FOLLOWING {following.length}</h1></Link>
                                </div>
                            </div>

                            <div className="block">
                                <form>
                                    <div className="grid gap-6 mb-6 md:grid-cols-1 p-7">
                                        <div>
                                            <hr className='border b-2 border-b-preto p-2.5 '></hr>
                                            <h1 className="pt-3">{username}</h1>
                                        </div>


                                        <div>
                                            <hr className='border b-2 border-b-preto p-2.5 '></hr>
                                            <h1 className="pt-3">{descricao}</h1>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className='flex flex-col'>
                {(positionMAJOR == 0) &&
                    <>
                        <div className="flex items-center justify-center pt-10 mt-10 pb-10 mb-10 ">
                            <h5 className="text-preto text-5xl font-bold ">{name.toUpperCase()}'S BOOKLET</h5>
                            <button onClick={() => { setPositionMAJOR(1) }} className="text-4xl px-5 pt-2"><HiArrowRight /></button>
                        </div>
                    </>
                }

                {(positionMAJOR == 1) &&
                    <>
                        <div className="flex items-center justify-center pt-10 mt-10 pb-10 ">
                            <button onClick={() => { setPositionMAJOR(0) }} className="text-4xl px-5 pt-2"><HiArrowLeft /></button>
                            <h5 className="text-preto text-5xl font-bold ">{name.toUpperCase()}'S CALENDAR</h5>
                        </div>
                    </>
                }


            </div>
            {(positionMAJOR == 0) &&
                <>
                    <section className='flex flex-col'>
                        <div className="w-full mb-3">
                            <button onClick={() => { handleClick(0); }} className={botao0}>ARTISTS</button>
                            <button onClick={() => { handleClick(1); }} className={botao1}>ALBUMS</button>
                            <button onClick={() => { handleClick(2); }} className={botao2}>TRACKS</button>
                        </div>
                    </section>

                    <section className='  flex flex-col'>

                        {(position === 0 && docsArtists == '') &&
                            <div className='flex w-full justify-center col-span-6 pt-10 pb-10'>
                                <h1 className='text-2xl text-preto text-center mr-2'>NO ARTISTS IN THIS BOOKLET YET. </h1>
                            </div>}

                        {position === 0 && docsArtists != undefined &&
                            <div id="caderneta" className="grid grid-cols-3 w-full mb-20" >
                                {docsArtists.map((element, index) => (
                                    <div className="col-span-1 flex items-center justify-center" >
                                        <div className="flex flex-col items-center justify-center  grid-item grid-column-1 grid-row-1">
                                            <Link to="/artist" state={{ id: docsIdArtists[index] }} key={index}>
                                                <div className="m-5">
                                                    <img src={element.image} className="bg-preto rounded-full w-[17rem] h-[17rem] object-cover "></img>
                                                </div></Link>

                                            <div className="pl-3 pr-3 pb-3 ">
                                                <p>{element.artist}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>}

                        {(position === 1 && docsAlbums == '') &&
                            <div className='flex w-full justify-center col-span-6 pt-10 pb-10'>
                                <h1 className='text-2xl text-preto text-center mr-2'>NO ALBUMS IN THIS BOOKLET YET. </h1>
                            </div>}


                        {position === 1 && docsAlbums != undefined &&
                            <div id="caderneta" className="grid-cols-3  w-full flex mb-20" >

                                {docsAlbums.map((element, index) => (
                                    <div className="col-span-1 flex items-center justify-center " >
                                        <div className="flex flex-col items-center justify-center  grid-item  grid-row-1">
                                            <Link to="/album" state={{ id: docsIdAlbums[index] }} key={index}>
                                                <div className="m-5">
                                                    <img src={element.image} className="w-[17rem] h-[17rem] object-cover "></img>
                                                </div></Link>

                                            <div className="pl-3 pr-3 pb-3 ">
                                                <p>{element.album}</p>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>}


                        {(position === 2 && docsTracks == '') &&
                            <div className='flex w-full justify-center col-span-6 pt-10 pb-10'>
                                <h1 className='text-2xl text-preto text-center mr-2'>NO TRACKS IN THIS BOOKLET YET. </h1>
                            </div>}

                        {position === 2 && docsTracks != undefined &&
                            <>
                                <div className="grid grid-cols-9 px-20 w-full items-center py-10">
                                    <div className='grid grid-cols-6 col-start-1 col-span-6'>
                                        {docsTracks.map((element, index) => (
                                            <div key={index} className='col-start-1 col-span-6 grid grid-cols-6 text-preto/50 hover:text-preto focus:text-preto text-left group' onMouseEnter={() => { setHoverTrack(docsTracksImage[index]); }} >
                                                <div className='col-start-1 col-span-3 text-2xl font-bold my-2 flex items-center'>
                                                    <button className='w-[30px]' onClick={() => { audio == 0 ? playTrack(index) : pauseTrack() }}>{audio == 0 ? <FaPlay className='hidden group-hover:block focus:outline-0 w-[50%]' /> : <FaPause className='hidden group-hover:block focus:outline-0 w-[50%]' />}</button>
                                                    <h1 className='flex items-center'>{element.toUpperCase()} {explicitTracks[index] ? <MdExplicit className='ml-1 mt-1' /> : null}</h1>
                                                </div>
                                                <div className='col-start-4 col-span-3 text-2xl font-bold my-2 flex justify-between'>
                                                    <h1>{trackAlbum[index].toUpperCase()}</h1>

                                                </div>
                                            </div>
                                        ))
                                        }
                                        <audio ref={audioRef} controls={false} type="audio/mpeg"></audio>
                                    </div>
                                    <div className='col-start-7 col-span-3 items-center flex justify-center'>
                                        {hoverTrack != '' &&
                                            <img className='w-[50%] text-center' src={hoverTrack} alt='Selected Tracks Album Cover' />
                                        }
                                    </div>
                                </div>


                            </>

                        }


                    </section>

                </>
            }
            {(positionMAJOR == 1) &&
                <>
                    <CalendarUser userId={iduser} />
                </>
            }



        </>
    );
}

export default Profile