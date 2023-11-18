import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotificationBuilder(props) {
    const navigate = useNavigate();

    return (
        <>
            {props.fcmMessages.map((message, index) => {
                return <div id="toast-simple" className="z-[200] fixed top-16 w-[20vw] right-5 flex items-center p-4 bg-amarelo rounded-lg text-preto cursor-pointer" role="alert"
                    key={index} onClick={() => { navigate(`notifications`) }}>
                    <img src={message.data.url} className="w-10 h-10 rounded-full object-cover" focusable="false" alt={message.notification.title}></img>
                    <div className='flex flex-col'>
                        <div className="pl-4 text-md font-semibold">{message.notification.title}</div>
                        <div className="pl-4 text-sm font-normal">{message.notification.body}</div>
                    </div>
                </div>
            })}
        </>
    )

}
