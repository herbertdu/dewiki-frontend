import React, { FC, useState, useEffect } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { getArticle } from '../utils/article';
import processParams from '../utils/component';
import Header from '../components/Header';
import { useVoerkaI18n } from '@voerkai18n/react';

interface EditProps {
    articleId: number;
    lang: string;
}

const Edit: FC<EditProps> = (props) => {
    const [vd, setVd] = useState<Vditor>();
    const [article, setArticle] = useState({ content: '', name: '' });
    const { t, activeLanguage, changeLanguage, languages } = useVoerkaI18n();
    const langs = languages.map((language) => language.name);

    useEffect(() => {
        if (props.lang !== activeLanguage && langs.includes(props.lang)) {
            changeLanguage(props.lang);
        }
        const fetchArticle = async () => {
            let feArticle = await getArticle(props.articleId, props.lang);
            setArticle(feArticle);

            const vditor = new Vditor('vditor', {
                after: () => {
                    vditor.setValue(article.content);
                    setVd(vditor);
                },
                outline: { enable: true, position: 'left' },
            });
        };
        fetchArticle();
        return () => {
            vd?.destroy();
            setVd(undefined);
        };
    }, [article.content, props.lang]);

    const saveChanges = () => {
        if (vd) {
            const editedContent = vd.getValue();
            console.log(editedContent);
        }
    };

    return (
        <div>
            <Header />
            <button
                className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color mb-2"
                onClick={saveChanges}
            >
                {t('Publish changes')}
            </button>
            <div id="vditor" className="vditor" />
        </div>
    );
};

export const EditWithParams = processParams(Edit);

export default Edit;
