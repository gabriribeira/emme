import React, { useState, useRef, useEffect } from "react";

export default function FadeInSection(props) {
    const [isVisible, setVisible] = useState(false);

    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisible(true);
                observer.unobserve(domRef.current);
            }
        });

        observer.observe(domRef.current);

        return () => observer.unobserve(domRef.current);
    }, []);

    return (
        <div
            ref={domRef}
            className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
        >
            {props.children}
        </div>
    );
}
