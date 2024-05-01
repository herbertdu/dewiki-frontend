import React, { useState, useRef, useEffect } from 'react';
import { useVoerkaI18n } from '@voerkai18n/react';
import { useNavigate } from 'react-router-dom';


const ChangeLanguage: React.FC = () => {
    const { t, activeLanguage, changeLanguage, languages} = useVoerkaI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [buttonPos, setButtonPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const node = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Add logic to handle clicks outside
        const handleClickOutside = (e: MouseEvent) => {
            if (node.current?.contains(e.target as Node)) {
                // If the click is inside, do nothing
                return;
            }
            // If the click is outside, close the menu
            setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClick = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setButtonPos({ top: rect.bottom, left: rect.left });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex justify-between items-center w-20 relative" ref={node}>
            <button
                className="inline-block relative px-2 py-1 bg-white text-black cursor-pointer hover:bg-white uppercase rounded-md"
                onClick={handleClick}
                ref={buttonRef}
            >
                {activeLanguage} {isOpen ? '▲' : '▼'}
            </button>
            {isOpen && (
                <div
                    className="fixed bg-white min-w-max shadow-lg z-10"
                    style={{ top: buttonPos.top, left: buttonPos.left }}
                >
                    {' '}
                    {languages.map((lang) => (
                        <button
                            className="block w-full text-left px-3 py-2 text-black hover:bg-gray-200"
                            key={lang.name}
                            onClick={() => {
                                let hash = window.location.hash;
                                console.log('hash', hash)
                                if (hash === '' || hash === '#/') {
                                   navigate(`/${lang.name}`, { replace: true });
                                } else {
                                    let url = hash.replace(/#\/\w+/, `/${lang.name}`);
                                    console.log(url)
                                    navigate(`${url}`, { replace: true });
                                }
                                changeLanguage(lang.name);
                                setIsOpen(false);
                            }}
                        >
                            {lang.title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChangeLanguage;
