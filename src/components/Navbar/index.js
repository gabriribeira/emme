import React, { useEffect, useState } from 'react'
import {Route, Redirect, NavLink, useLocation } from 'react-router-dom';
import '../../index.css'

const Navbar = () => {

    const location = useLocation();

    const link = 'text-preto z-[100] hover:fill-none hover:stroke-preto';
    const selectedLink = 'text-rosa z-[100]';
    const customLink = 'text-cinza z-[100]'
    const [link1, setLink1] = useState();
    const [link2, setLink2] = useState();
    const [link3, setLink3] = useState();
    const [link4, setLink4] = useState();

    useEffect(() => {
        switch (location.pathname) {

            case "/wordle":

                setLink1(customLink);
                setLink2(link);
                setLink3(link);
                setLink4(link);

                break;

            case "/about":

                setLink1(selectedLink);
                setLink2(customLink);
                setLink3(customLink);
                setLink4(customLink);

                break;

            case '/':

                setLink1(selectedLink);
                setLink2(link);
                setLink3(link);
                setLink4(link);

                break;

            case '/notifications':

                setLink2(selectedLink);
                setLink1(link);
                setLink3(link);
                setLink4(link);

                break;

            case '/emmes':

                setLink3(customLink);
                setLink1(link);
                setLink2(link);
                setLink4(link);

                break;

            case '/profile':
                setLink4(selectedLink);
                setLink1(link);
                setLink2(link);
                setLink3(link);
                break;

            case '/user':
                setLink4(selectedLink);
                setLink1(link);
                setLink2(link);
                setLink3(link);
                break;

            case '/friends':
                setLink4(selectedLink);
                setLink1(link);
                setLink2(link);
                setLink3(link);
                break;

            default:

                setLink1(selectedLink);
                setLink2(link);
                setLink3(link);
                setLink4(link);

                break;
        }
    }, [location.pathname])

    return (
        <section className='flex justify-around bg-transparent text-7xl -mt-[10px]'>
            <ul className='flex w-full justify-around'>
                <li className={link1}><NavLink to="/" >EMME</NavLink></li>
                <li className={link2}><NavLink to="/notifications" >NEW</NavLink></li>
                <li className={link3}><NavLink to="/emmes" >EMMES</NavLink></li>
                <li className={link4}><NavLink to="/profile" >PROFILE</NavLink></li>
            </ul>
        </section>
    )
}

export default Navbar