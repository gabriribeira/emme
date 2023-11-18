import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsArrowDownLeft } from 'react-icons/bs';
import {TfiArrowTopLeft} from 'react-icons/tfi'

const Friends = () => {
    const [userlog, setUserLog] = useState("");
    const [thisUser, setThisUser] = useState("");
    const [id, setUserId] = useState("");
    const [name, setUserName] = useState("");
    const [viewing, setViewing] = useState("");

    const [isHovered, setIsHovered] = useState(false);
    const [friendId, setFriendId] = useState("");
    const [friendName, setFriendName] = useState("");
    const [friendImage, setFriendImage] = useState("");
    const [docsFriends, setDocsFriends] = useState("");
    const [docsIdFriends, setDocsIdFriends] = useState('');
    const [docsImageFriends, setDocsImageFriends] = useState('');
    var docsArrayFriends = [];
    var docsArrayIdFriends = [];
    var docsArrayImageFriends = [];

    const location = useLocation();
    const { iduser, from } = location.state;
    const navigate = useNavigate();
    


    console.log("é este aqui:" + iduser)
    useEffect(() => {

        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const getUserId = async () => {
                    const userSearchId = await auth.currentUser.uid;
                    setUserLog(userSearchId);
                }
                getUserId()
                getInfo();
            }
        });
    }, []);


    const getInfo = async () => {

        const userInfo = await getDoc(doc(db, 'users', iduser));
        const data = userInfo.data()
        console.log(data)
        setUserId(data.id)
        setUserName(data.name)



        const friends = await getDocs(collection(db, `users/${iduser}/${from}`));
        friends.forEach((doc) => {
            console.log(doc.data());
            docsArrayFriends.push(doc.data().name);
            docsArrayIdFriends.push(doc.data().id);
            docsArrayImageFriends.push(doc.data().photoUrl);
        });

        setDocsFriends(docsArrayFriends);
        console.log(docsArrayFriends);
        setDocsIdFriends(docsArrayIdFriends);
        setDocsImageFriends(docsArrayImageFriends);

    }

    return (

        <>
            <section className='w-full  flex flex-col'>
                <div class="w-full flex justify-between mt-10 mb-10">
                    <button className='text-6xl text-preto mx-10' onClick={() => { navigate(-1) }}><TfiArrowTopLeft /></button>
                    {iduser === auth.currentUser.uid ? <div class="mr-12 text-xl">MY {from.toUpperCase()}</div> : <div class="mr-12 text-xl">{name.toUpperCase()}'S {from.toUpperCase()}</div>}
                </div>

                <div className="grid grid-cols-4 gap-x-4 gap-y-4 place-items-center ml-12 mr-12 mb-12 ">
                    {docsFriends &&
                        docsFriends.map((element, index) => (
                            <Link to="/user" state={{ iduser: docsIdFriends[index] }} >
                                <div className=" transition ease-in-out delay-50 border border-preto flex flex-col w-[20rem] h-[20rem] items-center justify-center hover:bg-amarelo  hover:-translate-y-1 hover:scale-100  hover:border-0 duration-300" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                    <img src={docsImageFriends[index]} class=" m-5 rounded-full w-[12rem] h-[12rem] object-cover " ></img>
                                    <div className="pl-3 pr-3 pb-3 ">
                                        <p>{docsFriends[index]}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            </section>
        </>
    );

}

export default Friends