import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../../firebase';
import { doc, getDoc, getDocs, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdExplicit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx'

const Booklet = (props) => {

    const [botao0, setBotao0] = useState("text-xl w-1/3 pb-5 border-b-2 border-preto text-preto");
    const [botao1, setBotao1] = useState("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");
    const [botao2, setBotao2] = useState("text-xl w-1/3 pb-5 border-b-2 border-preto/30 hover:border-preto/60 text-preto/30 hover:text-preto/70");

    const [position, setPosition] = useState(0);
    const [trackIndex, setTrackIndex] = useState(0);
    const [audio, setAudio] = useState(0);
    const [hoverTrack, setHoverTrack] = useState('');
    const [explicitTracks, setExplicitTracks] = useState('');
    const [trackAlbum, setTrackAlbum] = useState('');

    const [docsAr, setDocsArId] = useState();
    const [docsArtists, setDocsArtists] = useState();
    const [docsArtistsId, setDocsArtistsId] = useState('');
    const [docsArtistsImage, setDocsArtistsImage] = useState('');
    const [selectedArtistId, setSelectedArtistId] = useState('');

    const [docsAlb, setDocsAlbId] = useState();
    const [docsAlbums, setDocsAlbums] = useState();
    const [docsAlbumsId, setDocsAlbumsId] = useState('');
    const [docsAlbumsImage, setDocsAlbumsImage] = useState('');
    const [selectedAlbumId, setSelectedAlbumId] = useState('');

    const [docsT, setDocsTId] = useState();
    const [docsTracks, setDocsTracks] = useState();
    const [docsTracksId, setDocsTracksId] = useState('');
    const [docsTracksImage, setDocsTracksImage] = useState('');
    const [selectedTrackId, setSelectedTrackId] = useState('');
    const [modalDelete, setModalDelete] = useState('hidden');

    const [deleteRefresh, setDeleteRefresh] = useState(0)


    const audioRef = useRef(null);

    useEffect(() => {

        const getUserInfo = async () => {

            const caderneta_artists = await getDocs(collection(db, `users/${props.userId}/artists`));
            if (caderneta_artists != '' && caderneta_artists != undefined && caderneta_artists != null) {
                var docsArrayArId = [];
                var docsArrayArtists = [];
                var docsArrayArtistsId = [];
                var docsArrayArtistsImage = [];

                caderneta_artists.forEach((doc) => {
                    console.log("id do doc do artista: " + doc.id)
                    docsArrayArId.push(doc.id)
                    docsArrayArtists.push(doc.data().artist);
                    docsArrayArtistsId.push(doc.data().artistId);
                    docsArrayArtistsImage.push(doc.data().image);

                });
                setDocsArId(docsArrayArId);
                setDocsArtists(docsArrayArtists);
                setDocsArtistsId(docsArrayArtistsId);
                setDocsArtistsImage(docsArrayArtistsImage);
            }


            const caderneta_albums = await getDocs(collection(db, `users/${props.userId}/albums`));
            if (caderneta_albums != '' && caderneta_albums != undefined && caderneta_albums != null) {
                var docsArrayAlbId = [];
                var docsArrayAlbums = [];
                var docsArrayAlbumsId = [];
                var docsArrayAlbumsImage = [];

                caderneta_albums.forEach((doc) => {

                    console.log(doc.data());
                    docsArrayAlbId.push(doc.id)
                    docsArrayAlbums.push(doc.data().album);
                    docsArrayAlbumsId.push(doc.data().albumId);
                    docsArrayAlbumsImage.push(doc.data().image);

                });
                setDocsAlbId(docsArrayAlbId);
                setDocsAlbums(docsArrayAlbums);
                setDocsAlbumsId(docsArrayAlbumsId);
                setDocsAlbumsImage(docsArrayAlbumsImage);
            }

            const caderneta_tracks = await getDocs(collection(db, `users/${props.userId}/tracks`));
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

        }

        getUserInfo();

    }, [props.userId, deleteRefresh]);

    const modalDeleteFunction = () => {
        if (modalDelete == 'hidden') {
            setModalDelete(' h-screen w-screen bg-black/60 z-[1000] flex fixed top-0 justify-center items-center')
        } else {
            setModalDelete('hidden');
        }
    }

    const deleteArtistFromBooklet = async () => {
        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/artists`, selectedArtistId));
        setDeleteRefresh(deleteRefresh + 1);

    }

    const deleteAlbumFromBooklet = async () => {
        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/albums`, selectedAlbumId));
        setDeleteRefresh(deleteRefresh + 1);


    }

    const deleteTrackFromBooklet = async () => {
        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/tracks`, selectedTrackId));
        setDeleteRefresh(deleteRefresh + 1);
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
        <section>
            <section className='flex flex-col'>

                <div className="w-full mb-3">
                    <button onClick={() => { handleClick(0); }} className={botao0}>ARTISTS</button>
                    <button onClick={() => { handleClick(1); }} className={botao1}>ALBUMS</button>
                    <button onClick={() => { handleClick(2); }} className={botao2}>TRACKS</button>
                </div>

            </section>

            <section className='flex flex-col'>
                {(position === 0 && docsArtists != undefined) &&
                    <div id="caderneta" className="grid grid-cols-3 w-full pb-20" >
                        {docsArtists.map((element, index) => (
                            <>
                                <div className=" col-span-1 flex items-center justify-center" >
                                    <div className="flex  flex-col items-center justify-center grid-item grid-column-1 grid-row-1">
                                        <Link to="/artist" state={{ id: docsArtistsId[index] }} key={index}>
                                            <div className="m-5">
                                                <img src={docsArtistsImage[index]} className="bg-preto rounded-full w-[17rem] h-[17rem] object-cover"></img>
                                            </div>
                                        </Link>
                                        <div className="group pl-3 pr-3 pb-3 flex">
                                            <p className="text-xl text-preto">{element}</p>
                                            <button className='text-xl hidden group-hover:block ml-3 pt-2' onClick={() => { setSelectedArtistId(docsAr[index]); modalDeleteFunction() }}><RxCross1 /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className={modalDelete}>
                                    <div className='bg-preto w-[30vw] h-auto shadow-2xl flex flex-col justify-center text-center items-center rounded-xl p-8'>
                                        <h1 className='text-cinza'>ARE YOU SURE YOU WANT TO REMOVE THIS ITEM FROM YOUR BOOKLET?</h1>
                                        <div className='flex justify-center items-center m-5'>
                                            <button type='button' className='mr-2 py-2 px-5  w-[5rem] rounded-full bg-amarelo text-xl text-preto outline-none ' onClick={() => { modalDeleteFunction(); deleteArtistFromBooklet() }}>Yes</button>
                                            <button type='button' className='ml-2 py-2 px-5  w-[5rem] rounded-full bg-amarelo text-xl text-preto outline-none ' onClick={() => { modalDeleteFunction(); }}>No</button>
                                        </div>

                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                }
                {(position === 0 && docsArtists == '') &&
                    <div className='flex w-full justify-center col-span-6 pt-10 pb-10'>
                        <h1 className='text-xl text-preto text-center mr-2'>NO ARTISTS IN YOUR BOOKLET YET. </h1>
                        <Link to="/search"><h1 className='text-xl text-preto text-center underline hover:text-amarelo'>ADD SOME.</h1></Link>
                    </div>
                }

                {position === 1 && docsAlbums != undefined &&
                    <div id="caderneta" className="grid grid-cols-3 w-full mb-20" >
                        {docsAlbums.map((element, index) => (
                            <>
                                <div class="flex flex-col items-center justify-center  grid-item  grid-row-1">
                                    <Link to="/album" state={{ id: docsAlbumsId[index] }} key={index}>
                                        <div className="m-5">
                                            <img src={docsAlbumsImage[index]} className="w-[17rem] h-[17rem] object-cover "></img>
                                        </div>
                                    </Link>


                                    <div className="group pl-3 pr-3 pb-3 flex">
                                        <p className="text-2xl text-preto">{element}</p>
                                        <button className='text-xl hidden group-hover:block ml-3 pt-2' onClick={() => { setSelectedAlbumId(docsAlb[index]); modalDeleteFunction() }}><RxCross1 />

                                        </button>
                                    </div>
                                </div>
                                <div className={modalDelete}>
                                    <div className='bg-preto w-[30vw] h-auto shadow-2xl flex flex-col justify-center text-center items-center rounded-xl p-8'>
                                        <h1 className='text-cinza'>ARE YOU SURE YOU WANT TO REMOVE THIS ITEM FROM YOUR BOOKLET?</h1>
                                        <div className='flex justify-center items-center m-5'>
                                            <button type='button' className='mr-2 py-2 px-5  w-[5rem] rounded-full bg-amarelo text-xl text-preto outline-none ' onClick={() => { modalDeleteFunction(); deleteAlbumFromBooklet() }}>Yes</button>
                                            <button type='button' className='ml-2 py-2 px-5  w-[5rem] rounded-full bg-amarelo text-xl text-preto outline-none ' onClick={() => { modalDeleteFunction(); }}>No</button>
                                        </div>

                                    </div>
                                </div>

                            </>

                        ))}
                    </div>
                }
                {(position === 1 && docsAlbums == '') &&
                    <div className='flex w-full justify-center col-span-6 pt-10 pb-10'>
                        <h1 className='text-xl text-preto text-center mr-2'>NO ALBUMS IN YOUR BOOKLET YET. </h1>
                        <Link to="/search"><h1 className='text-xl text-preto text-center underline hover:text-amarelo'>ADD SOME.</h1></Link>
                    </div>
                }

                {position === 2 && docsTracks != undefined &&
                    <>
                        <div className="grid grid-cols-9 px-20 w-full items-center py-10">
                            <div className='grid grid-cols-6 col-start-1 col-span-6'>
                                {docsTracks.map((element, index) => (
                                    <div key={index} className='col-start-1 col-span-6 grid grid-cols-6 text-preto/50 hover:text-preto focus:text-preto text-left group' onMouseEnter={() => { setHoverTrack(docsTracksImage[index]); }} >
                                        <div className='col-start-1 col-span-3 text-xl font-bold my-2 flex items-center'>
                                            <button className='w-[30px]' onClick={() => { audio == 0 ? playTrack(index) : pauseTrack() }}>{audio == 0 ? <FaPlay className='hidden group-hover:block focus:outline-0 w-[50%]' /> : <FaPause className='hidden group-hover:block focus:outline-0 w-[50%]' />}</button>
                                            <h1 className='flex items-center'>{element.toUpperCase()} {explicitTracks[index] ? <MdExplicit className='ml-1 mt-1' /> : null}</h1>
                                        </div>
                                        <div className='col-start-4 col-span-3 text-xl font-bold my-2 flex justify-between'>
                                            <h1>{trackAlbum[index].toUpperCase()}</h1>
                                            <button className='text-xl hidden group-hover:block ml-3 pt-2' onClick={() => { setSelectedTrackId(docsT[index]); modalDeleteFunction() }}><RxCross1 />

                                            </button>
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
                        <div className={modalDelete}>
                            <div className='bg-preto w-[30vw] h-auto shadow-2xl flex flex-col justify-center text-center items-center rounded-xl p-8'>
                                <h1 className='text-cinza'>ARE YOU SURE YOU WANT TO REMOVE THIS ITEM FROM YOUR BOOKLET?</h1>
                                <div className='flex justify-center items-center m-5'>
                                    <button type='button' className='mr-2 py-2 px-5  w-[5rem] rounded-full bg-amarelo text-xl text-preto outline-none ' onClick={() => { modalDeleteFunction(); deleteTrackFromBooklet() }}>Yes</button>
                                    <button type='button' className='ml-2 py-2 px-5  w-[5rem] rounded-full bg-amarelo text-xl text-preto outline-none ' onClick={() => { modalDeleteFunction(); }}>No</button>
                                </div>

                            </div>
                        </div>

                    </>

                }

                {(position === 2 && docsTracks == '') &&
                    <div className='flex w-full justify-center col-span-6 pt-10 pb-10'>
                        <h1 className='text-xl text-preto text-center mr-2'>NO TRACKS IN YOUR BOOKLET YET. </h1>
                        <Link to="/search"><h1 className='text-xl text-preto text-center underline hover:text-amarelo'>ADD SOME.</h1></Link>
                    </div>
                }

            </section>
        </section>
    )
}

export default Booklet