import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from 'react-router-dom';
import { TfiArrowTopLeft } from 'react-icons/tfi'
import { db, auth } from "../../firebase"
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore"; 

const Index = () => {

    const [value, setValue] = useState('');
    const [uses, setUsers] = useState([]);
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [hoverTrack, setHoverTrack] = useState('');
    const [searchedUsers, setSearchedUsers] = useState('');
    const [searchedUsersId, setSearchedUsersId] = useState('');
    const [searchedUsersImage, setSearchedUsersImage] = useState('');
    const [searchedUsersUsername, setSearchedUsersUsername] = useState('');

    useEffect(() => {

        if (value != '') {

            let token = localStorage.getItem("Bearer");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            const url = 'https://api.spotify.com/v1/search?q=';
            const requestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            const fetchData = async () => {

                try {
                    await fetch(url + value + "&type=album,artist,track&limit=20", requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            setArtists(data.artists.items);
                            setAlbums(data.albums.items);
                            setTracks(data.tracks.items);
                        });
                } catch (error) {
                    console.log("error", error);
                }

            }

            fetchData();
        }

    }, [value]);

    useEffect(() => {

        if (value != '') {

            let token = localStorage.getItem("Bearer");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            const url = 'https://api.spotify.com/v1/search?q=';
            const requestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            const fetchData = async () => {

                try {
                    await fetch(url + value + "&type=album,artist,track&limit=20", requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            setArtists(data.artists.items);
                            setAlbums(data.albums.items);
                            setTracks(data.tracks.items);
                        });
                } catch (error) {
                    console.log("error", error);
                }

            }

            fetchData();
        }

    }, [value]);

    useEffect(() => {

        if (value != '') {

            var searchedUsersNameArray = [];
            var searchedUsersIdArray = [];
            var searchedUsersUsernameArray = [];
            var searchedUsersImageArray = [];

            const searchUsers = async () => {

                var usersRef = collection(db, "users");

                const q = query(usersRef, where("name", ">=", value), where("name", "<=", value + "\uf7ff"));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ",", doc.data());
                    searchedUsersNameArray.push(doc.data().name);
                    searchedUsersIdArray.push(doc.id);
                    searchedUsersUsernameArray.push(doc.data().username);
                    searchedUsersImageArray.push(doc.data().photoUrl);
                });

                setSearchedUsersId(searchedUsersIdArray);
                setSearchedUsers(searchedUsersNameArray);
                setSearchedUsersUsername(searchedUsersUsernameArray);
                setSearchedUsersImage(searchedUsersImageArray);

            }

            searchUsers();

        } else {

            setSearchedUsersId('');
            setSearchedUsers('');
            setSearchedUsersUsername('');
            setSearchedUsersImage('');

        }

    }, [value]);

    return (
        <section className='h-full min-h-screen flex flex-col overflow-x-hidden bg-rosa'>
            <div className='flex top-0 -mt-8 mx-10'>
                <li><Link to="/" className='text-preto text-7xl flex'>BACK<h1 className='mt-3'><TfiArrowTopLeft /></h1></Link></li>
            </div>
            <div className='w-full mt-40 flex justify-center'>
                <input value={value} onChange={(e) => setValue(e.target.value)} type="text" className='w-2/3 text-left bg-transparent text-preto text-2xl placeholder:text-2xl placeholder:text-preto focus:outline-none py-3 px-7 border-b-2 border-preto' placeholder='SEARCH' />
            </div>

            <div className='flex flex-col w-full mt-24'>

                <div className='w-full'>
                    <div className='ml-32'>
                        <Swiper
                            slidesPerView={5}
                            mousewheel={true}
                            modules={[Mousewheel]}
                            spaceBetween={0}
                            className="w-[100vw]"
                        >
                            {
                                artists.map((artist, index) => (
                                    <SwiperSlide key={index} className="w-full hover:bg-preto/10 p-5 rounded-lg">
                                        <Link to="/artist" state={{ id: artist.id }} className="w-full h-full">
                                            {artist.images[0] != undefined &&
                                                <div className='xl:h-[30vh] xl:w-[30vh] h-[20vh] w-[20vh] m-auto'>
                                                    <img className='rounded-full w-full h-full object-cover m-auto' src={artist.images[0].url} />
                                                </div>
                                            }
                                            <h1 className='text-center text-2xl font-semibold text-preto mt-4 h-full max-h-[10vh]'>{artist.name.toUpperCase()}</h1>
                                        </Link>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>

                <div className='w-full mt-10'>
                    <div className='ml-32'>
                        {albums.length != 0 ? <h1 className='text-4xl font-bold text-left text-amarelo'>ALBUMS</h1> : <h1></h1>}
                    </div>
                    <div className='w-full ml-32 mt-10'>
                        <Swiper
                            slidesPerView={5}
                            mousewheel={true}
                            modules={[Mousewheel]}
                            className="w-[100vw]"
                        >
                            {
                                albums.map((album, index) => (
                                    <SwiperSlide key={index} className="w-full hover:bg-preto/10 p-10 rounded-lg">
                                        <Link to="/album" state={{ id: album.id }} className="w-full h-[40vh]">
                                            {album.images[0] != undefined &&
                                                <div className='xl:h-[30vh] xl:w-[30vh] h-[20vh] w-[20vh] m-auto'>
                                                    <img src={album.images[0].url} className="w-full h-full object-cover m-auto" />
                                                </div>
                                            }
                                            <h1 className='text-center xl:text-2xl text-xl font-semibold text-preto pt-4 max-h-[10vh]'>{album.name.toUpperCase()}</h1>
                                        </Link>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>

                <div className='w-full mt-16'>

                    <div className='ml-32'>
                        {tracks.length != 0 ? <h1 className='text-4xl font-bold text-left text-amarelo'>TRACKS</h1> : <h1></h1>}
                    </div>

                    <div className='ml-32 mr-32 my-10 grid grid-cols-4 items-center'>

                        <div className="col-start-1 col-span-3">
                            {
                                tracks.map((track, index) => (
                                    <div key={index} className="grid grid-cols-3 items-start hover:bg-black/10 rounded-md px-2 py-2" onMouseEnter={() => { setHoverTrack(track.album.images[0].url) }}>
                                        <Link to="/album" state={{ id: track.album.id }} className="col-span-2">
                                            <h1 className='text-2xl text-left font-semibold text-preto pr-5'>{track.name.toUpperCase()}</h1>
                                        </Link>
                                        <Link to="/artist" state={{ id: track.artists[0].id }} className='col-span-1'>
                                            <h1 className='text-2xl text-left text-preto'>{track.artists[0].name.toUpperCase()}</h1>
                                        </Link>
                                    </div>

                                ))
                            }
                        </div>

                        <div className='col-start-4 col-span-1 items-center flex justify-center'>
                            {hoverTrack != '' &&
                                <img className='w-[75%] text-center' src={hoverTrack} alt='Selected Tracks Album Cover' />
                            }
                        </div>

                    </div>
                </div>

                <div className='w-full my-16'>

                    <div className='ml-32'>
                        {tracks.length != 0 ? <h1 className='text-4xl font-bold text-left text-amarelo'>USERS</h1> : <h1></h1>}
                    </div>

                    <div className='ml-32'>
                        <Swiper
                            slidesPerView={5}
                            mousewheel={true}
                            modules={[Mousewheel]}
                            spaceBetween={0}
                            className="w-[100vw]"
                        >
                            {searchedUsers != '' &&
                                searchedUsers.map((user, index) => (
                                    <SwiperSlide key={index} className="w-full hover:bg-preto/10 p-5 rounded-lg">
                                        <Link to="/user" state={{ iduser: searchedUsersId[index] }} className="w-full h-full">
                                            <div className='xl:h-[30vh] xl:w-[30vh] h-[20vh] w-[20vh] m-auto'>
                                                <img className='rounded-full w-full h-full object-cover m-auto' src={searchedUsersImage[index]} />
                                            </div>
                                            <h1 className='text-center text-2xl font-semibold text-preto mt-4 h-full'>{user.toUpperCase()}</h1>
                                            <h2 className='text-center text-xl font-semibold text-preto mt-4 h-full'>{searchedUsersUsername[index].toUpperCase()}</h2>
                                        </Link>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>

            </div>
        </section >
    )
}

export default Index;