import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import {TfiArrowTopLeft} from 'react-icons/tfi';

const Index = () => {

    const navigate = useNavigate()

    const [value, setValue] = useState("");
    const [attempt, setAttempt] = useState(1);
    const [step1, setStep1] = useState([]);
    const [step2, setStep2] = useState([]);
    const [step3, setStep3] = useState([]);
    const [step4, setStep4] = useState([]);
    const [step5, setStep5] = useState([]);
    const [step6, setStep6] = useState([]);
    const [albumName, setAlbumName] = useState('');
    const [albumImg, setAlbumImg] = useState("");
    const [winModal, setWinModal] = useState("hidden");

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const getUserId = () => {
                    const userSearchId = auth.currentUser.uid;
                }
                getUserId();
                getUserCalendar();
            }
        });
    }, []);

    const getUserCalendar = async () => {

        const date = new Date();

        const userLoggedInfoCalendar = await getDocs(query(collection(db, `users/${auth.currentUser.uid}/calendar`), orderBy("createdAt", "desc")));

        if (!userLoggedInfoCalendar.empty) {

            setAlbumName(tratarAlbumName(userLoggedInfoCalendar.docs[0].data().track));
            setAlbumImg(userLoggedInfoCalendar.docs[0].data().image);

        } else {

            const userLoggedInfoTracks = await getDocs(query(collection(db, `users/${auth.currentUser.uid}/tracks`), orderBy("createdAt", "desc")));

            if (!userLoggedInfoTracks.empty) {

                //setAlbumName(userLoggedInfoTracks.docs[0].data().track);
                setAlbumName(tratarAlbumName(userLoggedInfoTracks.docs[0].data().track));
                setAlbumImg(userLoggedInfoTracks.docs[0].data().image);

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
                                setAlbumImg(data.items[0].track.album.images[0].url)
                                setAlbumName(tratarAlbumName(data.items[0].track.name))
                            });
                    } catch (error) {
                        console.log("error", error);
                    }

                }

                fetchData();

            }

        }
    }

    const tratarAlbumName = (string) => {

        console.log(string)

        let nameWords = string.toLowerCase().split(" ");
        let nameReduced = [];

        const conditions = ["feat.", "(feat.", "remastered", "remix", "feat", "-", "live", "mix"];
        let conditionActive = 0;

        nameWords.map((element, index) => {

            switch (element) {

                case conditions[0]:
                case conditions[1]:
                case conditions[2]:
                case conditions[3]:
                case conditions[4]:
                case conditions[5]:
                case conditions[6]:
                case conditions[7]:
                    conditionActive = 1;
                    break;

                default:
                    if (conditionActive == 0) {
                        nameReduced.push(element);
                    }
                    break;

            }

        });

        let name = nameReduced.join(" ").toLowerCase().split("");
        let nameNormalized = [];

        name.forEach((element) => {

            switch (element) {
                case ",":
                case ")":
                case "(":
                case "-":
                case ".":
                case "'":
                    break;

                default:
                    nameNormalized.push(element);
                    break;
            }

        });

        return nameNormalized;

    }

    const saveAttempt = () => {

        let chars = value.split("");

        switch (attempt) {

            case 1:
                setStep1(chars);
                break;
            case 2:
                setStep2(chars);
                break;
            case 3:
                setStep3(chars);
                break;
            case 4:
                setStep4(chars);
                break;
            case 5:
                setStep5(chars);
                break;
            case 6:
                setStep6(chars);
                break;
        }

        setAttempt(attempt + 1);

    }

    const checkLetterExists = (letter) => {

        let response = false;

        albumName.map((element) => {
            if (letter == element) {
                response = true;
            }
        });

        return response;

    }

    const checkwin = () => {

        if (value == albumName.join("")) {
            setWinModal('w-screen h-screen absolute bg-preto/70 top-0 left-0 flex justify-center items-center');
        }

    }

    return (
        <section className='min-h-screen p-10 overflow-hidden'>
            <button className='text-6xl text-cinza left-[80px] top-[125px] absolute' onClick={() => { navigate(-1) }}><TfiArrowTopLeft /></button>
            <div className='flex flex-col justify-center items-center'>
                <img src={albumImg} className="shadow-2xl mb-10 w-[15rem] h-[15rem]" />
                <div className='flex flex-col'>
                    <div className='flex flex-row my-2'>
                        {(albumName != '' && albumName != undefined && albumName != null && albumName) &&
                            albumName.map((value, index) => (
                                albumName[index] == " " ? <span key={index} className='px-8'>{null}</span> : (step1[index] == undefined ? (<div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{null}</div>) : (checkLetterExists(step1[index]) ? (checkLetterExists(step1[index]) && albumName[index] == step1[index] ? <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{step1[index]}</div> : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-[#FFFF00] flex justify-center items-center'>{step1[index]}</div>) : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white/25 flex justify-center items-center'>{step1[index]}</div>))
                            ))}
                    </div>
                    <div className='flex flex-row my-2'>
                        {(albumName != '' && albumName != undefined && albumName != null && albumName) &&
                            albumName.map((value, index) => (
                                albumName[index] == " " ? <span key={index} className='px-8'>{null}</span> : step2[index] == undefined ? (<div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{null}</div>) : (checkLetterExists(step2[index]) ? (checkLetterExists(step2[index]) && albumName[index] == step2[index] ? <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{step2[index]}</div> : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-[#FFFF00] flex justify-center items-center'>{step2[index]}</div>) : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white/25 flex justify-center items-center'>{step2[index]}</div>)
                            ))}
                    </div>
                    <div className='flex flex-row my-2'>
                        {(albumName != '' && albumName != undefined && albumName != null && albumName) &&
                            albumName.map((value, index) => (
                                albumName[index] == " " ? <span key={index} className='px-8'>{null}</span> : step3[index] == undefined ? (<div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{null}</div>) : (checkLetterExists(step3[index]) ? (checkLetterExists(step3[index]) && albumName[index] == step3[index] ? <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{step3[index]}</div> : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-[#FFFF00] flex justify-center items-center'>{step3[index]}</div>) : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white/25 flex justify-center items-center'>{step3[index]}</div>)
                            ))}
                    </div>
                    <div className='flex flex-row my-2'>
                        {(albumName != '' && albumName != undefined && albumName != null && albumName) &&
                            albumName.map((value, index) => (
                                albumName[index] == " " ? <span key={index} className='px-8'>{null}</span> : step4[index] == undefined ? (<div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{null}</div>) : (checkLetterExists(step4[index]) ? (checkLetterExists(step4[index]) && albumName[index] == step4[index] ? <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{step4[index]}</div> : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-[#FFFF00] flex justify-center items-center'>{step4[index]}</div>) : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white/25 flex justify-center items-center'>{step4[index]}</div>)
                            ))}
                    </div>
                    <div className='flex flex-row my-2'>
                        {(albumName != '' && albumName != undefined && albumName != null && albumName) &&
                            albumName.map((value, index) => (
                                albumName[index] == " " ? <span key={index} className='px-8'>{null}</span> : step5[index] == undefined ? (<div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{null}</div>) : (checkLetterExists(step5[index]) ? (checkLetterExists(step5[index]) && albumName[index] == step5[index] ? <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{step5[index]}</div> : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-[#FFFF00] flex justify-center items-center'>{step5[index]}</div>) : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white/25 flex justify-center items-center'>{step5[index]}</div>)
                            ))}
                    </div>
                    <div className='flex flex-row my-2'>
                        {(albumName != '' && albumName != undefined && albumName != null && albumName) &&
                            albumName.map((value, index) => (
                                albumName[index] == " " ? <span key={index} className='px-8'>{null}</span> : step6[index] == undefined ? (<div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{null}</div>) : (checkLetterExists(step6[index]) ? (checkLetterExists(step6[index]) && albumName[index] == step6[index] ? <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white flex justify-center items-center'>{step6[index]}</div> : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-[#FFFF00] flex justify-center items-center'>{step6[index]}</div>) : <div key={index} className='w-[50px] h-[50px] mx-2 rounded-lg bg-black/50 font-bold text-4xl text-white/25 flex justify-center items-center'>{step6[index]}</div>)
                            ))}
                    </div>
                </div>
            </div>
            <div className='flex justify-center absolute bottom-10 left-0 right-0'>
                <form onSubmit={(e) => { saveAttempt(); e.preventDefault(); setValue(""); checkwin(); }}>
                    <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className='bg-transparent border-b-2 border-b-preto focus:outline-none p-3 text-3xl font-bold placeholder:text-preto/20 placeholder:font-bold text-center' placeholder='Your Guess Here!' autoFocus maxLength={albumName.length} minLength={albumName.length} />
                </form>
            </div>
            <div className={winModal}>
                <div className='bg-preto w-[30vw] h-[30vh] flex flex-col items-center shadow-xl rounded-xl'>
                    <div className='flex w-full justify-end mr-5'>
                        <button className='text-4xl font-bold text-end text-cinza' onClick={() => { setWinModal('hidden') }}>X</button>
                    </div>
                    <div className='flex items-center justify-center h-full'>
                        <h1 className='font-bold text-6xl text-center w-full text-cinza'>THAT'S RIGHT!</h1>
                    </div>
                    <div className='flex items-center justify-center'>
                        <button className="text-preto bg-amarelo px-5 py-3 text-xl my-5 rounded-full" onClick={() => { window.location.reload(false) }}>PLAY AGAIN</button>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Index;