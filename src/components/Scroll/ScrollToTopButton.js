import { useState, useEffect } from 'react';
import './ScrollToTopButton.scss';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible &&
                <button
                    className="scroll-to-top"
                    onClick={scrollToTop}
                    title="Về đầu trang"
                >
                    <i className="fas fa-arrow-up"></i>
                </button>
            }
        </>
    );
};

export default ScrollToTopButton;