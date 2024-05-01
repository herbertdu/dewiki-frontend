import React, { FC, useState, useEffect, ComponentType } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { getArticle } from '../utils/article';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { t } from '../languages';
import processParams from '../utils/component';

interface EditProps {
    articleId: number;
    lang: string;
}

const Edit: FC<EditProps> = (props) => {
    const [vd, setVd] = useState<Vditor>();
    const [article, setArticle] = useState({ content: '', name: '' });

    useEffect(() => {
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
    }, [article.content]);

    const saveChanges = () => {
        if (vd) {
            const editedContent = vd.getValue();
            console.log(editedContent);
        }
    };

    return (
        <div>
            <button
                className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color rounded-md"
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
