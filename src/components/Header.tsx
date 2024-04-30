import React from 'react';
import ChangeLanguage from './ChangeLanguage';
import { useVoerkaI18n } from '@voerkai18n/react';

const Header = () => {
    const { t } = useVoerkaI18n();
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="flex items-center space-x-2">
        <img src="/logo.svg" alt="DeWiki logo" className="w-8 h-8" />
        <a href='/' className="text-lg font-semibold">DeWiki</a>
      </div>
      <nav className="hidden md:block space-x-8">
        <a href="#" className="hover:text-indigo-color">{t('Categories')}</a>
        <a href="#" className="text-black hover:text-indigo-color">{t('About')}</a>
        <a href="#" className="text-black hover:text-indigo-color">{t('More')}</a>
      </nav>
      <div className="flex items-center space-x-4">
        <input type="text" placeholder="Search articles, categories, tags and users" className="px-4 py-2 border border-gray-300 rounded-md" />
            <ChangeLanguage />
        <button className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color rounded-md">Sign In</button>
      </div>
    </header>
  );
};

export default Header;