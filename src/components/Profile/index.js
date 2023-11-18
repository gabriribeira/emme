import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { HiClock } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../../firebase';
import { doc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import {CiPower} from 'react-icons/ci';
import Booklet from "./Booklet";
import Calendar from "./Calendar";
import { FiEdit2 } from "react-icons/fi"
import { AiOutlineCheckCircle } from "react-icons/ai"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { signOut } from 'firebase/auth';

const Profile = () => {

    const [position, setPosition] = useState(0);

    const [followers, setFollowers] = useState("");
    const [following, setFollowing] = useState("");

    const [user, setUser] = useState("");
    const [id, setUserId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [username, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const [file, setFile] = useState("");

    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newImage, setNewImage] = useState("");

    const [image, setImage] = useState("");
    const [email, setEmail] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const navigate = useNavigate();
    const [calendar, setCalendar] = useState();

    const [botaoEdit, setBotaoEdit] = useState();
    const [readOnly1, setReadOnly1] = useState(true);
    const [readOnly2, setReadOnly2] = useState(true);
    const [readOnly3, setReadOnly3] = useState(true);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const getUserId = () => {
                    const userSearchId = auth.currentUser.uid;
                    setUser(userSearchId);
                }
                getUserId();
                getUserInfo();
            }
        });
    }, []);

    const getUserInfo = async () => {

        const userLoggedInfo = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const data = userLoggedInfo.data();
        setName(data.name);
        setEmail(data.email);
        setUserName(data.username);
        setDescription(data.description)
        setUserId(data.id);
        setCreatedAt(data.createdAt);
        setUserImage(data.photoUrl)


        const followers = await getDocs(collection(db, `users/${auth.currentUser.uid}/followers`));
        var docsFollowers =[];
        followers.forEach((doc) => {
            console.log("id do doc do artista: " + doc.id)
            docsFollowers.push(doc.id)
        });
        setFollowers(docsFollowers);


        const following = await getDocs(collection(db, `users/${auth.currentUser.uid}/following`));
        var docsFollowing =[];
        following.forEach((doc) => {
            console.log("id do doc do artista: " + doc.id)
            docsFollowing.push(doc.id)
        });
        setFollowing(docsFollowing);
        
    
     
    }

    useEffect(() => {

        const handleImageUpload = () => {

            if (file) {

                const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                    },
                    (err) => console.log(err),
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                            setNewImage(url);
                            updateDoc(doc(db, 'users', auth.currentUser.uid), {
                                photoUrl: url
                            })
                        }

                        )
                    })
            }
        }

        handleImageUpload();

    }, [file]);

 

    const posicao1 =  ()=>{
        setPosition(1)
    }

    const posicao2 =  ()=>{
        setPosition(0)
    }

    const changeState1 = async () => {
        if (readOnly1 == true) {
            setReadOnly1(false)
        } else {
            setReadOnly1(true)
        }

    }

    const changeState2 = async () => {
        if (readOnly2 == true) {
            setReadOnly2(false)
        } else {
            setReadOnly2(true)
        }
    }

    const changeState3 = async () => {
        if (readOnly3 == true) {
            setReadOnly3(false)
        } else {
            setReadOnly3(true)
        }
    }

    const handleChangeFile = (event) => {
        console.log(1)
        setFile(event.target.files[0]);
    }

    const handleChange = async () => {
        switch (botaoEdit) {
            case 1:
                updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    username: newUsername,
                })
                setUserName(newUsername);
                break;
            case 2:
                updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    email: newEmail,
                })
                setEmail(newEmail);
                break;
            case 3:
                updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    description: newDescription,
                })
                setEmail(newEmail);
                break;
        }
    }

    const signOut = () => {

        navigate("/login");
        signOut(auth);

    }

    return (
        <>
            <section className='h-full overflow-hidden pb-16'>
                <section className='h-full flex flex-col'>
                    <div className="h-screen">
                        <div className="grid grid-cols-2 absolute z-10 top-0 h-screen overflow-hidden">
                            <div className="z-10 w-[50vw] p-4 bg-rosa flex flex-col items-center justify-center col-start-1 col-span-1">
                                <div className="pt-10 group flex items-center justify-center">
                                    <div>
                                        <img src={newImage != '' ? newImage : userImage} className="rounded-full w-[32rem] h-[32rem] object-cover" />
                                    </div>
                                    <label className="text-5xl hidden group-hover:flex justify-center absolute w-[32rem] h-[32rem] items-center bg-preto/70 rounded-full cursor-pointer" htmlFor="file_input">
                                        <FiEdit2 />
                                    </label>
                                    <input className="hidden" aria-describedby="file_input_help" id="file_input" type="file" accept="image/*" onChange={handleChangeFile} />
                                </div>
                            </div>

                            <div className="w-[50vw] mt-40 p-4 pt-0 items-center flex-col justify-center col-start-2 col-span-1">
                                <div className="block ">
                                    <h5 className="text-preto  text-5xl p-7">HI {name.toUpperCase()}! <button className="text-4xl text-preto hover:text-amarelo" onClick={() => {signOut()}}><CiPower /></button></h5>
                                    <div className="flex items-center p-7 pt-0">
                                        <Link to="/friends" state={{ iduser: user, from: "followers" }}><h1 className="text-xl ml-1 mr-3 hover:text-amarelo">{followers.length} FOLLOWERS</h1></Link>
                                        <span className="bg-amarelo rounded-full w-[14px] h-[14px]"></span>
                                        <Link to="/friends" state={{ iduser: user, from: "following" }}><h1 className="text-xl  mx-3 hover:text-amarelo">FOLLOWING {following.length}</h1></Link>
                                    </div>
                                </div>

                                <div className="grid gap-6 mb-6 md:grid-cols-1 p-7">

                                    {readOnly1 == true &&
                                        <div className="group">
                                            <hr className=' border b-2 border-b-preto p-2.5 '></hr>
                                            <div className="flex">
                                                <h1 className="pt-3">{username}</h1>
                                                <button className='text-right text-l hidden group-hover:block ml-5 pt-2' onClick={(e) => { e.preventDefault(); changeState1(); setBotaoEdit(1); handleChange() }}>{readOnly1 ? <FiEdit2 /> : <AiOutlineCheckCircle />}</button>
                                            </div>
                                        </div>
                                    }

                                    {readOnly1 == false &&
                                        <div className='group flex items-center'>
                                            <input type="text" className=" bg-transparent border-b border-preto text-preto  block w-full pl-0 p-2.5  focus:outline-none " placeholder="new username" onChange={(e) => setNewUsername(e.target.value)}></input>
                                            <button className='text-right  text-l hidden group-hover:block ml-5 pt-2' onClick={(e) => { e.preventDefault(); changeState1(); setBotaoEdit(1); handleChange() }}>{readOnly1 ? <FiEdit2 /> : <AiOutlineCheckCircle />}</button>
                                        </div>
                                    }

                                    {readOnly2 == true &&
                                        <div className="group">
                                            <hr className=' border b-2 border-b-preto p-2.5 '></hr>
                                            <div className="flex">
                                                <h1 className="pt-3">{email}</h1>
                                                <button className='text-right text-l hidden group-hover:block ml-5 pt-2' onChange={(e) => setNewUsername(e.target.value)} onClick={(e) => { e.preventDefault(); changeState2(); setBotaoEdit(2); handleChange() }}>{readOnly2 ? <FiEdit2 /> : <AiOutlineCheckCircle />}</button>
                                            </div>
                                        </div>
                                    }

                                    {readOnly2 == false &&
                                        <div className='group flex items-center'>
                                            <input type="text" className="bg-transparent border-b border-preto text-preto block w-full pl-0 p-2.5 focus:outline-none " placeholder="new email" onChange={(e) => setNewEmail(e.target.value)} ></input>
                                            <button className='text-right text-l hidden group-hover:block ml-5 pt-2' onClick={(e) => { e.preventDefault(); changeState2(); setBotaoEdit(2); handleChange() }}>{readOnly2 ? <FiEdit2 /> : <AiOutlineCheckCircle />}</button>
                                        </div>
                                    }

                                    {readOnly3 == true &&
                                        <div className="group">
                                            <hr className=' border b-2 border-b-preto p-2.5 '></hr>
                                            <div className="flex">
                                                <h1 className="pt-3">{description}</h1>
                                                <button className='text-right text-l hidden group-hover:block ml-5 pt-2' onClick={(e) => { e.preventDefault(); changeState3(); setBotaoEdit(3); handleChange() }}> {readOnly3 ? <FiEdit2 /> : <AiOutlineCheckCircle />}</button>
                                            </div>
                                        </div>
                                    }

                                    {readOnly3 == false &&
                                        <div className='group flex items-center'>
                                            <input type="text" className="bg-transparent border-b border-preto text-preto block w-full pl-0 p-2.5 focus:outline-none  " placeholder="about you" onChange={(e) => setNewDescription(e.target.value)}></input>
                                            <button className='text-right text-xl hidden group-hover:block ml-5 pt-2' onClick={(e) => { e.preventDefault(); changeState3(); setBotaoEdit(3); handleChange() }}> {readOnly3 ? <FiEdit2 /> : <AiOutlineCheckCircle />}</button>
                                        </div>
                                    }

                                </div>

                            </div>
                        </div>
                    </div>
                </section>
                <div className='flex flex-col'>
                        {(position==0) &&
                        <>
                        <div className="flex items-center justify-center pt-10 mt-10 pb-10 mb-10 ">
                            <h5 className="text-preto text-5xl  ">{name.toUpperCase()}'S BOOKLET</h5>
                            <button onClick={()=>{setPosition(1)}} className="text-4xl px-5 pt-2"><HiArrowRight /></button>
                            </div>
                        </>
                        }

                        {(position==1) &&
                        <>
                        <div className="flex items-center justify-center pt-10 mt-10 pb-10 ">
                            <button onClick={()=>{setPosition(0)}} className="text-4xl px-5 pt-2"><HiArrowLeft /></button>
                            <h5 className="text-preto text-5xl">{name.toUpperCase()}'S CALENDAR</h5>
                            </div>
                        </>
                        }
                       
                    
                </div>
                {(position==0) &&
                        <>
                        <Booklet userId={user} userName={name} />
                        </>
                        }
                {(position==1) &&
                <>
                    <Calendar />
                 </>
                }
               
            </section>
        </>
    );
}

export default Profile

