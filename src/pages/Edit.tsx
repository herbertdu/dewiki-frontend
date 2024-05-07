import React, { FC, useState, useEffect } from 'react';
import Vditor from 'vditor';
import { countWords, getArticle, getChanges } from '../utils/article';
import processParams from '../utils/component';
import Header from '../components/Header';
import { useVoerkaI18n } from '@voerkai18n/react';
import Footer from '../components/Footer';
import Editor from '../components/Editor';
import { checkWallet } from '../utils/wallet';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import { sendMessage } from '../utils/message';
import StyledTextField from '../components/Common';

interface EditProps {
    articleId: number;
    lang: string;
}

const Edit: FC<EditProps> = (props) => {
    const [vd, setVd] = useState<Vditor>();
    const [article, setArticle] = useState({ content: 'Loading...', title: '', latestMr: 0 });
    const { t } = useVoerkaI18n();
    const editorId = `vditorEdit${props.articleId}${props.lang}`;

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [response, setResponse] = useState({ mrId: 0, mrData: {} });

    useEffect(() => {
        const fetchArticle = async () => {
            let feArticle = await getArticle(props.articleId, props.lang);
            setArticle(feArticle);
            if (vd) {
                vd.setValue(feArticle.content);
            }
        };
        fetchArticle();
    }, [props.articleId, props.lang]);

    const handleOk = () => {
        setVisible(false);
        setLoading(false);
    };

    const [wordCount, setWordCount] = useState(0);
    const handleWordCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWordCount(parseInt(event.target.value));
    };

    const handleAutoCount = () => {
        let changes = getChanges(article.content, vd?.getValue() || '');
        let addChanges = changes.split('\n').map((line) => {
            if (line.startsWith('+')) {
                return decodeURIComponent(line.slice(1));
            } else {
                return '';
            }
        });
        let content = addChanges.join('');
        const cnt = countWords(content, props.lang);
        setWordCount(cnt);
    };

    const [editSummary, setEditSummary] = useState('');
    const handleEditSummary = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditSummary(event.target.value);
    };

    const handleSave = async () => {
        if (!checkWallet()) {
            return;
        }
        let changes = getChanges(article.content, vd?.getValue() || '');
        let data = {
            articleId: props.articleId,
            lang: props.lang,
            wordCount: wordCount,
            baseMr: article.latestMr,
            changes: changes,
            editSummary: editSummary,
        };
        let confirmData = JSON.parse(JSON.stringify(data));
        confirmData.changes = decodeURIComponent(confirmData.changes);
        if (
            window.confirm(`${t('data is')}:\n${JSON.stringify(confirmData, null, 2)}\n\n${t('Are you sure to save')}?`)
        ) {
            console.log(data);
            setLoading(true);
            let Messages = await sendMessage('CreateMr', data, 'CreatedMr');
            setResponse(JSON.parse(Messages[0].Data));
            setVisible(true);
        }
    };

    return (
        <div>
            <Header />
            <h1 className="text-center font-bold text-5xl mb-5 capitalize">{article.title}</h1>

            {article.content !== 'Loading...' && <Editor keyID={editorId} bindVditor={setVd} initialValue={article.content} />}

            <form noValidate autoComplete="off" className="mt-5">
                <StyledTextField
                    label={t('Valid Word Count') + '*'}
                    variant="outlined"
                    id="custom-css-outlined-input"
                    sx={{ width: '15ch' }}
                    value={wordCount}
                    onChange={handleWordCount}
                />
                <button type="button" className="bg-gray-200 px-4 py-1" onClick={handleAutoCount}>
                    {t('Auto Count')}
                </button>
            </form>

            <form noValidate autoComplete="off">
                <StyledTextField
                    label={t('Edit Summary')}
                    variant="outlined"
                    id="custom-css-outlined-input"
                    sx={{ width: '70%' }}
                    value={editSummary}
                    onChange={handleEditSummary}
                    multiline
                />
            </form>

            <div className="flex justify-center">
                <button
                    className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color mt-4 mb-2"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? `${t('Saving')}...` : `${t('Save')}`}
                </button>
            </div>
            <Modal title="Edit Success" open={visible} onOk={handleOk} onCancel={handleOk}>
                <div className="text-lg text-gray-500 font-semibold text-center">MR Id: {response?.mrId}</div>
                <div className="text-lg text-gray-500 underline font-semibold text-center mb-10">
                    <Link to={`/${props.lang}/a/${props.articleId}/mr`}>
                        <div>{t('View')}</div>
                    </Link>
                </div>
            </Modal>
            <Footer />
        </div>
    );
};

export const EditWithParams = processParams(Edit);

export default Edit;
