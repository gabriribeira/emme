import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginSucccess, setLoginSucccess] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const signInFunction = () => {

        signInWithEmailAndPassword(auth, email, password)
            .then((credentials) => {
                setError(null);
                setLoginSucccess(true);
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            }).catch((error) => {
                setError(error.message);
            })

    }


    return (

        <div className="w-full">
            {error ?
                <div className="bg-rosa py-5 px-6 mb-2 mt-2 text-base text-white w-full" role="alert">
                    <p className="pl-4 text-xs ">Oh no ... Something went wrong!</p>
                </div>
                : null}

            {!error && loginSucccess ?
                <div className="bg-amarelo mt-2 py-5 px-6 mb-3 text-base text-white  w-full" role="alert">
                    <p className="pl-4 text-xs text-preto"> Logged in with success!</p>

                </div>
                : null}

            <div className="mb-16 mt-10 w-full px-10">
                <div className='flex flex-col w-full items-center mt-5'>
                    <input type="email" name="email" id="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} className="placeholder:text-cinza/30 w-full bg-transparent border-b border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none"></input>
                </div>

                <div className='flex flex-col w-full items-center mt-5'>
                    <input type="password" name="password" id="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} className="placeholder:text-cinza/30 w-full bg-transparent border-b border-cinza placeholder:text-cinza text-cinza p-1 focus:outline-none"></input>
                </div>

            </div>

            <div className='flex justify-center w-full'>
                <button type='button' onClick={() => { signInFunction() }} className='py-2 px-5 mb-10 w-[10rem] rounded-full bg-amarelo text-xl text-preto outline-none '>LOGIN</button>
            </div>

        </div>

    );
}

export default SignIn;
