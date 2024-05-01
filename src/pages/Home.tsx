import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { useVoerkaI18n } from '@voerkai18n/react';
import { useEffect } from 'react';

function Home() {
    let { lang = 'en' } = useParams();
    const { activeLanguage, changeLanguage, languages} = useVoerkaI18n();
    const langs = languages.map((language) => language.name);

    useEffect(() => {
        if (lang !== activeLanguage && langs.includes(lang)) {
            changeLanguage(lang);
        }
        return () => {};
    }, [lang]);
    if (!langs.includes(lang)) {
        return <div>Language not supported</div>;
    }

    return (
        <div>
            <Header />
            <div>
                <p className="text-blue-600">Hello, World!</p>
            </div>
        </div>
    );
}

export default Home;
