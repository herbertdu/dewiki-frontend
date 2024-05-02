import React, { useState } from 'react';
import ChangeLanguage from './ChangeLanguage';
import { useVoerkaI18n } from '@voerkai18n/react';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import { Link } from "react-router-dom";

const Header = () => {
    const { t, activeLanguage } = useVoerkaI18n();
    const isMobile = useMediaQuery('(max-width:600px)');
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const linker = (
        <>
            <Link to={`/${activeLanguage}/categories`} className="hover:text-indigo-color">
                <div>{t('Categories')}</div>
            </Link>
            <a href="#" className="text-black hover:text-indigo-color">{t('About')}</a>
            <a href="#" className="text-black hover:text-indigo-color">{t('More')}</a>
        </>
    )

    const drawer = (
        <div className="flex flex-col items-start space-y-4 p-4">
            <nav className="flex flex-col space-y-2">
                {linker}
            </nav>
            <div className="space-y-2">
                <input type="text" placeholder="Search articles, categories, tags and users" className="px-4 py-2 border border-gray-300 rounded-md w-full" />
                <ChangeLanguage />
                <button className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color rounded-md w-full">{t('Sign In')}</button>
            </div>
        </div>
    );

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow mb-4">
            <div className="flex items-center space-x-2">
                <img src="logo.svg" alt="DeWiki logo" className="w-8 h-8" />
                <Link to={"/"} className="text-lg font-semibold">
                    <div>DeWiki</div>
                </Link>
            </div>
            {isMobile ? (
                <div className="flex items-center">
                    <ChangeLanguage />
                    <button onClick={handleDrawerToggle}>
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </button>
                    <Drawer anchor="right" open={open} onClose={handleDrawerToggle}>
                        {drawer}
                    </Drawer>
                </div>
            ) : (
                <>
                    <nav className="flex flex-row space-x-8">
                        {linker}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <input type="text" placeholder="Search articles, categories, tags and users" className="px-4 py-2 border border-gray-300 rounded-md" />
                        <ChangeLanguage />
                        <button className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color rounded-md">{t('Sign In')}</button>
                    </div>
                </>
            )}

        </header>
    );
};

export default Header;
