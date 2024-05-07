import { useEffect, useState } from 'react';
import { getLangVersion } from '../utils/article';
import processParams from '../utils/component';
import { t } from '../languages';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Mr {
    state: string;
    baseMr: number;
    editor: string;
    reward: string;
    freeze: string;
    startHeight: number;
    endHeight: number;
    wordCount: number;
    editSummary: string;
    changes: string;
}

const ListMr = ({ mrId, mr }: { mrId: number; mr: Mr }) => (
    <div className="border-b border-gray-200 py-4">
        <div className="flex justify-between items-center">
            <div>
                <p className="font-bold">MR Id: {mrId}</p>
                <p className="space-x-3">
                    <span>{t('state')}: {mr.state}</span>
                    <span>{t('base MR')}: {mr.baseMr}</span>
                </p>
                <p className="space-x-3">
                    <span>{t('reward')}: {parseInt(mr.reward) / 1e12}</span>
                    <span>{t('freeze')}: {parseInt(mr.freeze) / 1e12}</span>
                </p>
                <p className="space-x-3">
                    <span>{t('start block')}: {mr.startHeight}</span>
                    <span>{t('end block')}: {mr.endHeight}</span>
                </p>
                <p>{t('word count')}: {mr.wordCount}</p>
                <p>{t('editor')}: {mr.editor}</p>
                <p>{t('edit summary')}: {mr.editSummary}</p>
                <p>
                    {t('changes')}:
                    <br />
                    {decodeURIComponent(mr.changes).slice(0, 200)}
                </p>
            </div>
        </div>
    </div>
);

const Mr = ({ articleId, lang }: { articleId: number; lang: string }) => {
    const [mrs, setMrs] = useState<Mr[]>([]);
    const [title, setTitle] = useState('');
    useEffect(() => {
        const fetchMrs = async () => {
            let langVersion = await getLangVersion(articleId, lang);
            setMrs(langVersion.mrs);
            setTitle(langVersion.title);
        };

        fetchMrs();
    }, [articleId, lang]);
    console.log(mrs);

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">{title} MR:</h1>
                {mrs && [...mrs].reverse().map((mr, index) => <ListMr mrId={mrs.length - index} mr={mr} />)}
            </div>
            <Footer />
        </>
    );
};

export default Mr;

export const MrWithParams = processParams(Mr);
