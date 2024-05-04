import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const Footer = () => {
    const repoURL = 'https://github.com/dewikiDao/dewiki-frontend';
    return (
        <footer className="bg-gray-200 p-4 mt-10">
            <div className="flex flex-col items-center space-y-2">
                <span>Powered by</span>
                <div className="flex items-center space-x-2">
                    <img src="logo.svg" alt="logo" className="w-8 h-8" />
                    <Link to={'/'} className="text-lg font-semibold">
                        <div>DeWiki</div>
                    </Link>
                </div>
            </div>
            <div className="flex items-center space-x-2 mb-4">
                <span>Follow us on</span>
                <div className="flex space-x-2">
                    <a href={repoURL} title={repoURL} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} className="fab" />
                    </a>
                </div>
            </div>
            {/* <div className="flex space-x-4">
                <a href="/cookie-policy" className="text-black">
                    Cookie Policy
                </a>
                <a href="/privacy-policy" className="text-black">
                    Privacy Policy
                </a>
            </div> */}
            <div className="flex items-end justify-end">
                <div>
                    <span>DeWiki v1.0.0</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
