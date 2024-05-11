import { useEffect, useState } from 'react';
import { getLangVersion } from '../utils/article';
import processParams from '../utils/component';
import { useVoerkaI18n } from '@voerkai18n/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { formatDwk } from '../utils/fund';
import { formatTimestamp } from '../utils/date';

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
    editType: string;
    translationProgress: string;
    endTranslatedHeight: number;
    freezeForBeTranslated: string;
    createTimestamp: number;
    appeals: any[];
    guaranteedId: number;
}

const Mr = ({ articleId, lang }: { articleId: number; lang: string }) => {
    const { t } = useVoerkaI18n();
    const [mrs, setMrs] = useState<Mr[]>([]);
    const [title, setTitle] = useState('');

    const ListMr = ({ mrId, mr }: { mrId: number; mr: Mr }) => (
        <div className="border-b border-gray-200 py-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold">MR Id: {mrId}</p>
                    <p className="space-x-3">
                        <span>
                            {t('state')}: {mr.state}
                        </span>
                        <span>
                            {t('base MR')}: {mr.baseMr}
                        </span>
                        <span>
                            {t('edit type')}: {mr.editType}
                        </span>
                    </p>
                    <p className="space-x-3">
                        <span>
                            {t('create time')}: {formatTimestamp(mr.createTimestamp)}
                        </span>
                    </p>
                    <p className="space-x-3">
                        <span>
                            {t('translation progress')}: {mr.translationProgress}
                        </span>
                        <span>
                            {t('end translated block')}: {mr.endTranslatedHeight}
                        </span>
                    </p>
                    <p className="space-x-3">
                        <span>
                            {t('appeals')}: {mr.appeals}
                        </span>
                        <span>
                            {t('guaranteed Id')}: {mr.guaranteedId}
                        </span>
                    </p>
                    <p className="space-x-3">
                        <span>
                            {t('reward')}: {formatDwk(mr.reward)}
                        </span>
                        <span>
                            {t('freeze')}: {formatDwk(mr.freeze)}
                        </span>
                    </p>
                    <p className="space-x-3">
                        <span>
                            {t('freeze for be translated')}: {formatDwk(mr.freezeForBeTranslated)}
                        </span>
                    </p>
                    <p className="space-x-3">
                        <span>
                            {t('start block')}: {mr.startHeight}
                        </span>
                        <span>
                            {t('end block')}: {mr.endHeight}
                        </span>
                    </p>
                    <p>
                        {t('valid word count')}: {mr.wordCount}
                    </p>
                    <p>
                        {t('editor')}: {mr.editor}
                    </p>
                    <p>
                        {t('edit summary')}: {mr.editSummary}
                    </p>
                    <p>
                        {t('changes')}:
                        <br />
                        {decodeURIComponent(mr.changes).slice(0, 200)}
                    </p>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        const fetchMrs = async () => {
            let langVersion = await getLangVersion(articleId, lang);
            setMrs(langVersion.mrs);
            setTitle(langVersion.title);
        };

        fetchMrs();
    }, [articleId, lang]);

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto p-4">
                <div className="text-2xl font-semibold text-start mb-10 capitalize">
                    <Link className=" text-gray-500 underline" to={`/${lang}/a/${articleId}`}>
                        <span>{title}</span>
                    </Link>
                    <span> MR:</span>
                </div>
                {mrs && [...mrs].reverse().map((mr, index) => <ListMr mrId={mrs.length - index} mr={mr} />)}
            </div>
            <Footer />
        </>
    );
};

export default Mr;

export const MrWithParams = processParams(Mr);
