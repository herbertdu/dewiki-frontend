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
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Footer from '../components/Footer';
import { getChanges, countWords } from '../utils/article';
import StyledTextField from '../components/Common';
import Vditor from 'vditor';
import Editor from '../components/Editor';
import { getGroups, Group } from '../utils/dao';

const CreateArticle = () => {
    const { t } = useVoerkaI18n();

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState({ articleId: 0, articleData: {} });
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [editSummary, setEditSummary] = useState('');
    const [vd, setVd] = useState<Vditor>();
    const [groups, setGroups] = useState<Group[]>([]);
    const [group, setGroup] = useState('');

    const handleChange = (event: SelectChangeEvent<string>) => {
        setCategory(event.target.value);
    };

    const handleTooltipClick = () => {
        setOpen(!open);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTags(event.target.value);
    };

    const handleWordCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWordCount(parseInt(event.target.value));
    };

    const handleAutoCount = () => {
        let content = vd?.getValue() || '';
        const cnt = countWords(content);
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
            group: parseInt(group),
            enTitle: title,
            category: category,
            tags: tagsParsed,
            wordCount: wordCount,
            editSummary: editSummary,
            changes: changes,
        };
        if (window.confirm(`${t('data is')}:\n${JSON.stringify(data, null, 2)}\n\n${t('Are you sure to save')}?`)) {
            setLoading(true);
            let Messages = await sendMessage('CreateArticle', data, 'CreatedArticle');
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
            let categories = await getCategories();
            setCategories(categories);

            const feGroups = await getGroups();
            setGroups(feGroups);
        }
        fetch();
    }, []);

    let categoryIndex = categories.map((category: any, index) => {
        let categoryId = index + 1;
        let categoryName = category.names['en'];
        return { categoryId, categoryName };
    });

    const categoryOptions = (
        <FormControl sx={{ width: '25ch', marginRight: '20px', marginBottom: '20px' }}>
            <InputLabel id="demo-simple-select-label">{t('Category')}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Category"
                onChange={handleChange}
            >
                {categoryIndex.map((category) => (
                    <MenuItem
                        value={category.categoryId}
                        key={category.categoryId}
                    >{`${category.categoryId} - ${category.categoryName}`}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    const handleGroup = (event: SelectChangeEvent<string>) => {
        setGroup(event.target.value);
    };
    const groupOptions = (
        <FormControl sx={{ width: '25ch', marginRight: '20px', marginBottom: '20px' }}>
            <InputLabel id="demo-simple-select-label">{t('group') + '*'}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={group}
                label="group"
                onChange={handleGroup}
                error={group === ''}
            >
                {groups.map((group: any) => (
                    <MenuItem value={group.info.groupId.toString()} key={group.info.name}>
                        {`${group.info.groupId} - ${group.info.name}`}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    return (
        <>
            <Header />
            <h1 className="text-start text-2xl mt-10 mb-5">{t('Create article')}</h1>
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
                        <StyledTextField
                            label={t('Language')}
                            variant="outlined"
                            id="custom-css-outlined-input"
                            sx={{ width: '10ch' }}
                            defaultValue="English"
                            disabled // disable user input
                        />
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

                    {categoryOptions}

                    {groupOptions}

                    <form noValidate autoComplete="off">
                        <StyledTextField
                            label={t('Tags')}
                            variant="outlined"
                            id="custom-css-outlined-input"
                            sx={{ width: '20ch' }}
                            value={tags}
                            onChange={handleTagsChange}
                        />
                    </form>

                    <h1 className="text-start font-bold text-3xl mt-10 mb-5 capitalize">{t('Content')}</h1>
                    <Editor keyID="vditorCreateArticle" bindVditor={setVd} />

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
                    <Modal title="Create Article Success" open={visible} onOk={handleOk} onCancel={handleOk}>
                        <div className="text-lg text-gray-500 font-semibold text-center">
                            articleId: {response?.articleId}
                        </div>
                        <div className="text-lg text-gray-500 underline font-semibold text-center mb-10">
                            <Link to={`/en/a/${response?.articleId}`}>
                                <div>{t('View')}</div>
                            </Link>
                            <Link to={`/en/a/${response?.articleId}/edit`}>
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

export default CreateArticle;
