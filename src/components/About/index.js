import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TfiArrowTopLeft } from 'react-icons/tfi';
import gabriel from '../../assets/gabriribeira.jpg'
import logo from '../../assets/logo.png'

import mariana from '../../assets/marimarques.png'
import Transition from '../Transitions/'

const About = () => {

    const location = useLocation()
    const navigate = useNavigate();

    return (
        <section className='h-full flex flex-col'>
            <button className='text-6xl text-cinza left-[80px] top-[125px] absolute' onClick={() => { navigate(-1) }}><TfiArrowTopLeft /></button>
            <div className='h-screen  flex  justify-end items-end'>
                <div className='flex pb-12'>
                    <img src={logo} className="w-[70rem] "/>
                </div>
            </div>
            
            <div className='flex flex-col pt-52 pb-28'>
                <div className='grid grid-cols-3 px-36 items-center py-10'>
                    <div className='text-xl text-cinza col-span-2 flex justify-start mr-10'>
                        Collaboratively iterate multidisciplinary products vis-a-vis goal-oriented methods of empowerment. Uniquely promote world-class leadership without technically sound strategic theme areas. Holisticly optimize multifunctional web-readiness vis-a-vis backward-compatible communities. Monotonectally grow out-of-the-box value without user friendly niches. Competently leverage other's exceptional functionalities for holistic metrics.

                        Distinctively mesh real-time meta-services after backend core competencies. Progressively conceptualize team building best practices with robust benefits. Enthusiastically create resource maximizing quality vectors for leading-edge deliverables. Completely redefine prospective imperatives with resource sucking channels. Dramatically reintermediate performance based web-readiness via 24/365 relationships.
                    </div>
                    
                    <div className='flex justify-end col-span-1'>
                        <img className='w-[25rem] h-[25rem] object-cover rounded-full' src={gabriel} alt="web developer absolutamente lindo de leiria" />
                    </div>
                </div>
                <div className='grid grid-cols-3 px-36 items-center py-10'>
                    <div className='flex justify-start col-span-1'>
                        <img className='w-[25rem] h-[25rem] object-cover rounded-full' src={mariana} alt="web developer absolutamente linda de águeda" />
                    </div>
                    <div className='text-xl text-cinza col-span-2 flex justify-end ml-10'>
                        Collaboratively iterate multidisciplinary products vis-a-vis goal-oriented methods of empowerment. Uniquely promote world-class leadership without technically sound strategic theme areas. Holisticly optimize multifunctional web-readiness vis-a-vis backward-compatible communities. Monotonectally grow out-of-the-box value without user friendly niches. Competently leverage other's exceptional functionalities for holistic metrics.

                        Distinctively mesh real-time meta-services after backend core competencies. Progressively conceptualize team building best practices with robust benefits. Enthusiastically create resource maximizing quality vectors for leading-edge deliverables. Completely redefine prospective imperatives with resource sucking channels. Dramatically reintermediate performance based web-readiness via 24/365 relationships.
                    </div>
                </div>
            </div>
            <div className=''>
                <iframe src="https://open.spotify.com/embed/playlist/5LjMoUjVPKDZyaSj5ynLWA?utm_source=generator&theme=0" width="100%" className='h-screen p-20' frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </section>
    )
}

export default About