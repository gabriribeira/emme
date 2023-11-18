import React, { useState } from "react";
import SignIn from "./signIn";
import SignUp from "./signUp";

const Authentication = () => {

  const [modal, setModal] = useState('h-screen w-screen bg-black/60 z-[1000] flex fixed top-0 justify-center items-center');
  const [botao0, setBotao0] = useState("text-xl w-1/2 pb-5 border-b-2 border-amarelo text-amarelo");
  const [botao1, setBotao1] = useState("text-xl w-1/2 pb-5 border-b border-cinza/30 hover:border-cinza/60 text-cinza/30 hover:text-cinza/70");
  const [position, setPosition] = useState(0);

  const handleClick = (index) => {

    setPosition(index);

    switch (index) {
      case 0:

        setBotao0("text-xl w-1/2 pb-5 border-b-2 border-amarelo text-amarelo");
        setBotao1("text-xl w-1/2 pb-5 border-b border-cinza/30 hover:border-cinza/60 text-cinza/30 hover:text-cinza/70");
        break;

      case 1:

        setBotao0("text-xl w-1/2 pb-5 border-b border-cinza/30 hover:border-cinza/60 text-cinza/30 hover:text-cinza/70");
        setBotao1("text-xl w-1/2 pb-5 border-b-2 border-amarelo text-amarelo");
        break;
    }

  }

  return (

    <section>
      <div className={modal}>
        <div className='bg-preto w-[40vw] h-auto shadow-2xl flex flex-col  items-center rounded-xl'>
          <div className="w-full mb-3 mt-10">
            <button onClick={() => { handleClick(0); }} className={botao0}>SIGN IN</button>
            <button onClick={() => { handleClick(1); }} className={botao1}>SIGN UP</button>
          </div>

          {position === 0 &&

            <SignIn />

          }

          {position === 1 &&

            <SignUp />

          }

        </div>
      </div>
    </section>

  );
}

export default Authentication;
