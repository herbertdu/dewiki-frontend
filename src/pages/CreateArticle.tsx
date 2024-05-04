import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
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

const StyledTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'gray',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'black',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'black',
        },
    },
    marginBottom: '20px',
    marginRight: '20px',
});

const CreateArticle = () => {
    const { t } = useVoerkaI18n();

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState({ articleId: 0, articleData: {} });
    const [title, setTitle] = useState('');
    const [group, setGroup] = useState(0);
    const [tags, setTags] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [editSummary, setEditSummary] = useState('');
    const [vd, setVd] = useState<Vditor>();

    const handleChange = (event: SelectChangeEvent<string>) => {
        setCategory(event.target.value);
    };

    const handleTooltipClick = () => {
        setOpen(!open);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGroup(parseInt(event.target.value));
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
            group: group,
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
            console.log(response);
        }
    };

    const handleOk = () => {
        setVisible(false);
    };

    useEffect(() => {
        async function fetch() {
            checkWallet();
            let categories = await getCategories();
            setCategories(categories);
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

    let categoryIndex = categories.map((category: any, index) => {
        let categoryId = index + 1;
        let categoryName = category.names['en'];
        return { categoryId, categoryName };
    });

    const categoryOptions = (
        <FormControl sx={{ width: '25ch', marginRight: '20px' }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
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

    return (
        <>
            <Header />
            <div className="flex justify-center items-center">
                <div className="container">
                    <form noValidate autoComplete="off">
                        <StyledTextField
                            label={t('Title')}
                            variant="outlined"
                            id="custom-css-outlined-input"
                            sx={{ width: '70%' }}
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </form>

                    {categoryOptions}

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

                    <form noValidate autoComplete="off">
                        <StyledTextField
                            label={t('Group')}
                            variant="outlined"
                            id="custom-css-outlined-input"
                            sx={{ width: '8ch' }}
                            value={group}
                            onChange={handleGroupChange}
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
                            label={t('EditSummary')}
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
                            label={t('WordCount')}
                            variant="outlined"
                            id="custom-css-outlined-input"
                            sx={{ width: '11ch' }}
                            value={wordCount}
                            onChange={handleWordCount}
                        />
                        <button className="bg-gray-200 px-4 py-1" onClick={handleAutoCount}>
                            {t('auto count')}
                        </button>
                    </form>

                    <div className="flex justify-center">
                        <button
                            className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color mt-4 mb-2"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? `${t('Saving...')}` : `${t('Save')}`}
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
