import React, { useState, useRef, useEffect } from "react";

export default function FadeIn(props) {
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {

        setTimeout(() => {
            setVisible(true);
        }, 800);

    }, []);

    return (
        <div
            className={`fade-in-custom ${isVisible ? "is-visible" : ""}`}
        >
            {props.children}
        </div>
    );
}
