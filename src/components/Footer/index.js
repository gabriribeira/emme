import React from 'react';
import {Link} from 'react-router-dom';

const Index = () => {
  return (
    <section className="w-full fixed bottom-0 bg-cinza pb-3">
        <ul className='text-rosa text-xl w-full flex justify-around'>
            <Link to="/about">ABOUT</Link>
            <Link to="/wordle">WORDLE</Link>
            <a href='https://www.ua.pt/pt/deca/'>DeCA</a>
            <a href='https://open.spotify.com/?' target="_blank">SPOTIFY</a>
        </ul>
    </section>
  )
}

export default Index