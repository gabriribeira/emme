import React, { useEffect, useState } from 'react';
import { SlArrowRight } from "react-icons/sl"
import { SlArrowLeft } from "react-icons/sl"
import { TfiPlus } from "react-icons/tfi"
import {
    setDoc,
    doc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from "react-router-dom";
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

const SignUp = () => {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState("");
    const [image, setImage] = useState(null);
    const [loginSucccess, setLoginSucccess] = useState(false);
    const [error, setError] = useState(null);
    const [position, setPosition] = useState(0);
    const [progress, setProgress] = useState(1);
    const [creationSuccess, setCreationSuccess] = useState(false);
    const [verEmail, setVerEmail] = useState('hidden');
    const [verUsername, setVerUsername] = useState('hidden');
    const [emailValidation, setEmailValidation] = useState(0);
    const [usernameValidation, setUsernameValidation] = useState(0);

    const navigate = useNavigate();

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    }

    const registForward = () => {
        setProgress(progress + 1)
    }

    const registBackward = () => {
        setProgress(progress - 1)
    }

    useEffect(() => {

        const handleImageUpload = () => {

            if (file) {

                const uniqueId = Date.now();

                const storageRef = ref(storage, `/files/${file.name}${uniqueId}`);
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
                            setImage(url);
                        }

                        )
                    })
            }
        }

        handleImageUpload();

    }, [file]);

    const signUp = () => {

        if (email.length === 0 || password.length === 0 || firstName.length === 0) {
            setError('Name, email and password must be correctly filled')
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                setError(null);
                setCreationSuccess(true);
                setDoc(doc(db, "users", userCredential.user.uid), {
                    name: firstName + " " + secondName,
                    username: username,
                    email: email,
                    description: description,
                    photoUrl: image,
                    createdAt: serverTimestamp()
                });
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    };

    /*useEffect(() => {

        if (email != '') {

            const checkUserEmail = async () => {

                setVerEmail('text-cinza')
                var usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setEmailValidation(0);
                } else {
                    setEmailValidation(1);
                }

            }

            checkUserEmail();

        } else {
            setVerEmail('hidden');
        }

    }, [email]);

    useEffect(() => {

        if (username != '') {

            const checkUserUsername = async () => {

                setVerUsername('text-cinza')
                var usersRef = collection(db, "users");
                const q = query(usersRef, where("username", "==", username));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setUsernameValidation(0);
                } else {
                    setUsernameValidation(1);
                }
            }

            checkUserUsername();

        } else {
            setVerUsername('hidden');
        }

    }, [username]);*/

    return (
        <>
            <div className="w-full">
                {error ?
                    <div className="bg-rosa py-5 px-6 mb-2 mt-2 text-base text-white  w-full" role="alert">
                        <p className="pl-4 text-xs ">Oh no ... Something went wrong!</p>
                    </div>
                    : null}

                {!error && loginSucccess ?
                    <div className="bg-amarelo mt-2 py-5 px-6 mb-3 text-base text-white  w-full" role="alert">
                        <p className="pl-4 text-xs text-preto"> Account created, welcome!</p>

                    </div>
                    : null}

                <div className="mb-16 mt-10 w-full px-10">

                    {progress === 1 &&
                        <>
                            <div className='flex w-full items-center mt-5'>
                                <input type="email" name="email" id="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} className="placeholder:text-cinza/30 w-full bg-transparent border-b border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none"></input>
                                {/*<div className={verEmail}>{emailValidation == 0 ? <AiOutlineClose /> : <AiOutlineCheck />}</div>*/}
                            </div>

                            <div className='flex w-full items-center mt-5'>
                                <input type="username" name="username" id="username" placeholder="username" onChange={(e) => setUsername(e.target.value)} className="placeholder:text-cinza/30 w-full bg-transparent border-b border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none"></input>
                                {/*<div className={verUsername}>{usernameValidation == 0 ? <AiOutlineClose /> : <AiOutlineCheck />}</div>*/}
                            </div>

                            <div className='flex flex-col w-full items-center mt-5'>
                                <input type="password" name="password" id="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} className="placeholder:text-cinza/30 w-full bg-transparent border-b border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none"></input>
                            </div>
                        </>
                    }

                    {progress === 2 &&
                        <>
                            <div className='flex flex-col w-full items-center mt-5'>
                                <input type="text" name="1name" id="1name" placeholder="first name" onChange={(e) => setFirstName(e.target.value)} className="placeholder:text-cinza/30 w-full bg-transparent border-b border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none"></input>
                            </div>

                            <div className='flex flex-col w-full items-center mt-5'>
                                <input type="text" name="2name" id="2name" placeholder="second name" onChange={(e) => setSecondName(e.target.value)} className="placeholder:text-cinza/30 w-full bg-transparent border-b border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none"></input>
                            </div>

                            <div className='flex flex-col w-full items-center mt-5'>
                                <input type="text" name="descricao" id="descricao" placeholder="description" onChange={(e) => setDescription(e.target.value)} className="placeholder:text-cinza/30 w-full bg-transparent border-b border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none"></input>
                            </div>
                        </>
                    }

                    {progress === 3 &&
                        <>
                            {image == null
                                ?
                                <div className='flex justify-center'> <label className='mb-5 flex flex-col items-center justify-center rounded-full border border-cinza w-[150px] h-[150px] cursor-pointer' htmlFor="file_input"> <TfiPlus className="text-cinza text-3xl transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-100 duration-300"></TfiPlus> </label> </div>
                                :
                                <div className='text-center w-full flex justify-center'><img alt="profile_image" src={image} className="object-cover w-[150px] h-[150px] rounded-full" /></div>
                            }

                            <input className="hidden" aria-describedby="file_input_help" id="file_input" type="file" accept="image/*" onChange={handleChange} />
                            <div className='flex flex-col justify-center items-center'>
                                <h1 className='text-cinza font-bold text-xl '>UPLOAD A PHOTO</h1>
                                <p className="mt-1 text-sm text-cinza" id="file_input_help">SVG, PNG, JPG or GIF.</p>
                            </div>
                        </>
                    }

                    <div className="flex flex-row items-center justify-end mt-5 text-cinza text-xl">
                        {progress > 1 &&
                            <button type='button' onClick={() => { registBackward() }} className="text-left mx-1 mt-1"><SlArrowLeft></SlArrowLeft></button>
                        }
                        <div className="text-right mx-1"> {progress} </div>
                        <div className="text-right text-cinza/50 mx-1">/ 3</div>
                        {progress < 3 &&
                            <button type='button' onClick={() => { registForward() }} className="text-right mx-1 mt-1"><SlArrowRight></SlArrowRight></button>
                        }
                    </div>

                </div>

                <div className='flex justify-center w-full'>
                    <button type='button' onClick={() => { signUp() }} className='py-2 px-5 mb-10 w-[10rem] rounded-full bg-amarelo text-xl text-preto outline-none '>REGISTER</button>
                </div>

            </div>
        </>
    )
}

export default SignUp