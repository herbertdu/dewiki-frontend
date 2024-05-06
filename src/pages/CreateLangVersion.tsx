import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useVoerkaI18n } from '@voerkai18n/react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { sendMessage } from '../utils/message';
import { checkWallet } from '../utils/wallet';
import { getCategories } from '../utils/category';
import { Modal } from 'antd';
import { Link, useParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import Footer from '../components/Footer';
import { getChanges, countWords } from '../utils/article';
import StyledTextField from '../components/Common';

const CreateLangVersion = () => {
    const { t, languages } = useVoerkaI18n();
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState({ lang: '', versionData: {} });
    const [title, setTitle] = useState('');
    const [articleId, setArticleId] = useState(0);
    const [tags, setTags] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [editSummary, setEditSummary] = useState('');
    const [language, setLanguage] = useState('');
    const [vd, setVd] = useState<Vditor>();

    const handleLanguage = (event: SelectChangeEvent<string>) => {
        setLanguage(event.target.value);
    };

    const handleTooltipClick = () => {
        setOpen(!open);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleArticleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setArticleId(parseInt(event.target.value));
    };

    const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTags(event.target.value);
    };

    const handleWordCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWordCount(parseInt(event.target.value));
    };

    const handleAutoCount = () => {
        let content = vd?.getValue() || '';
        const cnt = countWords(content, language);
        setWordCount(cnt);
    };

    const handleEditSummary = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditSummary(event.target.value);
    };

    const handleSave = async () => {
        if (!checkWallet()) {
            return;
        }
        let tagsParsed: string[] = tags.split(',');
        let changes = getChanges('', vd?.getValue() || '');
        let data = {
            articleId: articleId,
            lang: language,
            title: title,
            tags: tagsParsed,
            wordCount: wordCount,
            editSummary: editSummary,
            changes: changes,
        };
        let confirmData = JSON.parse(JSON.stringify(data));
        confirmData.changes = decodeURIComponent(confirmData.changes);
        if (
            window.confirm(`${t('data is')}:\n${JSON.stringify(confirmData, null, 2)}\n\n${t('Are you sure to save')}?`)
        ) {
            setLoading(true);
            let Messages = await sendMessage('CreateLanguageVersion', data, 'CreatedLanguageVersion');
            setResponse(JSON.parse(Messages[0].Data));
            setVisible(true);
        }
    };

    const handleOk = () => {
        setVisible(false);
        setLoading(false);
    };

    useEffect(() => {
        async function fetch() {
            checkWallet();
            const vditor = new Vditor('vditor', {
                after: () => {
                    vditor.setValue('');
                    setVd(vditor);
                },
                outline: { enable: true, position: 'left' },
            });
        }
        fetch();

        return () => {
            vd?.destroy();
            setVd(undefined);
        };
    }, []);

    const languageOptions = (
        <FormControl sx={{ width: '25ch', marginRight: '20px', marginBottom: '20px' }}>
            <InputLabel id="demo-simple-select-label">{t('Language') + '*'}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={language}
                label="Language"
                onChange={handleLanguage}
                error={language === ''}
            >
                {languages.map(
                    (lang: any) =>
                        lang.name !== 'en' && (
                            <MenuItem value={lang.name} key={lang.name}>
                                {`${lang.name} - ${lang.title}`}
                            </MenuItem>
                        )
                )}
            </Select>
        </FormControl>
    );

    return (
        <>
            <Header />
            <h1 className="text-start text-2xl mt-10 mb-5">{t('Create language version')}</h1>
            <div className="flex justify-center items-center">
                <div className="container">
                    <form noValidate autoComplete="off">
                        <StyledTextField
                            label={t('Title') + '*'}
                            variant="outlined"
                            id="custom-css-outlined-input"
                            sx={{ width: '70%' }}
                            value={title}
                            onChange={handleTitleChange}
                            error={title === ''}
                        />
                    </form>

                    <form noValidate autoComplete="off">
                        {languageOptions}
                        <Tooltip
                            title={t(
                                'only support create English article first , and then you can create language version'
                            )}
                            open={open}
                            onClick={handleTooltipClick}
                        >
                            <IconButton>
                                <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </form>

                    <form noValidate autoComplete="off">
                        <StyledTextField
                            label={t('Article Id') + '*'}
                            variant="outlined"
                            id="custom-css-outlined-input"
                            sx={{ width: '10ch' }}
                            value={articleId}
                            onChange={handleArticleIdChange}
                            error={articleId === 0}
                        />
                        <StyledTextField
                            label={t('Tags')}
                            variant="outlined"
                            id="custom-css-outlined-input"
                            sx={{ width: '20ch' }}
                            value={tags}
                            onChange={handleTagsChange}
                        />
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

                    <h1 className="text-start font-bold text-3xl mt-10 mb-5 capitalize">{t('Content')}</h1>
                    <div id="vditor" className="vditor mb-20" />

                    <form noValidate autoComplete="off">
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

                    <div className="flex justify-center">
                        <button
                            className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color mt-4 mb-2"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? `${t('Saving')}...` : `${t('Save')}`}
                        </button>
                    </div>
                    <Modal title="Create Article Success" open={visible} onOk={handleOk} onCancel={handleOk}>
                        <div className="text-lg text-gray-500 font-semibold text-center">
                            language:{response?.lang} articleId: {articleId}
                        </div>
                        <div className="text-lg text-gray-500 underline font-semibold text-center mb-10">
                            <Link to={`/${response?.lang}/a/${articleId}`}>
                                <div>{t('View')}</div>
                            </Link>
                            <Link to={`/${response?.lang}/a/${articleId}/edit`}>
                                <div>{t('Edit')}</div>
                            </Link>
                        </div>
                    </Modal>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CreateLangVersion;
