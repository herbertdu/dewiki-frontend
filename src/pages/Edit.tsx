import React, { FC, useState, useEffect } from 'react';
import Vditor from 'vditor';
import { countWords, getArticle, getChanges, ArticleData } from '../utils/article';
import process2Params from '../utils/component';
import Header from '../components/Header';
import { useVoerkaI18n } from '@voerkai18n/react';
import Footer from '../components/Footer';
import Editor from '../components/Editor';
import { checkWallet } from '../utils/wallet';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import { sendMessage } from '../utils/message';
import StyledTextField from '../components/Common';
import { EDIT_TYPE } from '../constants/env';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { TranslationProgress } from '../components/CustomMui';
import { ShowDiff } from '../components/MrShowDiff';

interface EditProps {
  articleId: number;
  lang: string;
}

const Edit: FC<EditProps> = (props) => {
  const [vd, setVd] = useState<Vditor>();
  const [article, setArticle] = useState<ArticleData>();
  const { t } = useVoerkaI18n();
  const editorId = `vditorEdit${props.articleId}${props.lang}`;

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [response, setResponse] = useState({ mrId: 0, mrData: {} });
  const [editType, setEditType] = useState('');
  const [translationProgress, setTranslationProgress] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [showDiff, setShowDiff] = useState(false);

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

  if (!article) {
    return <div>Loading...</div>;
  }

  let isLatest = article.meta.latest.includes(props.lang);

  const handleEditType = (event: SelectChangeEvent<string>) => {
    setEditType(event.target.value);
  };

  const handleTranslationProgress = (event: SelectChangeEvent<string>) => {
    setTranslationProgress(event.target.value);
  };

  const handleOk = () => {
    setVisible(false);
  };

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
      editType: editType,
      translationProgress: translationProgress,
    };
    let confirmData = JSON.parse(JSON.stringify(data));
    confirmData.changes = decodeURIComponent(confirmData.changes);
    if (window.confirm(`${t('data is')}:\n${JSON.stringify(confirmData, null, 2)}\n\n${t('Are you sure to save')}?`)) {
      setLoading(true);
      let Messages = await sendMessage('CreateMr', data, 'CreatedMr');
      if (Messages.length > 0 && Messages[0].Data) {
        setResponse(JSON.parse(Messages[0].Data));
        setVisible(true);
      }
      setLoading(false);
    }
  };

  const editTypeOptions = (
    <FormControl sx={{ width: '18ch', marginRight: '20px', marginBottom: '20px' }}>
      <InputLabel id="demo-simple-select-label">{t('edit type') + '*'}</InputLabel>
      <Select
        id="demo-simple-select"
        value={editType}
        label="Language"
        onChange={handleEditType}
        error={editType === ''}
      >
        {isLatest ? (
          EDIT_TYPE.map((value: any) => (
            <MenuItem value={value} key={value}>
              {`${value}`}
            </MenuItem>
          ))
        ) : (
          <MenuItem value={EDIT_TYPE[0]} key={EDIT_TYPE[0]}>
            {`${EDIT_TYPE[0]}`}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-1">
        <h1 className="text-center font-bold text-5xl mb-5 capitalize">{article.title}</h1>
        {article && <Editor keyID={editorId} bindVditor={setVd} initialValue={article.content} />}

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

        {editTypeOptions}
        {editType === 'translate' && (
          <TranslationProgress
            translationProgress={translationProgress}
            handleTranslationProgress={handleTranslationProgress}
          />
        )}

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

        <div className="flex justify-center mt-4 mb-2">
          <button
            className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color mr-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? `${t('Saving')}...` : `${t('Save')}`}
          </button>

          <button onClick={() => setShowDiff(!showDiff)} className="bg-gray-200 px-4 py-2">
            <div className="capitalize">
              {t('show changes')} {showDiff ? '▲' : '▼'}
            </div>
          </button>
        </div>
        {showDiff && <ShowDiff oldContent={article.content} newContent={vd?.getValue() || ''} />}

        <Modal title="Edit Success" open={visible} onOk={handleOk} onCancel={handleOk}>
          <div className="text-lg text-gray-500 font-semibold text-center">MR Id: {response?.mrId}</div>
          <div className="text-lg text-gray-500 underline font-semibold text-center mb-10 capitalize">
            <Link to={`/${props.lang}/a/${props.articleId}/mr/${response?.mrId}`}>
              <div>{t('view MR')}</div>
            </Link>
            <Link to={`/${props.lang}/a/${props.articleId}`}>
              <div>{t('view article')}</div>
            </Link>
          </div>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export const EditWithParams = process2Params(Edit);

export default Edit;
