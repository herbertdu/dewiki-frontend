import { useState } from 'react';
import { formatDwk } from '../utils/fund';
import { formatTimestamp } from '../utils/date';
import { MrShowDiff } from '../components/MrShowDiff';
import { MrData } from '../utils/article';
import { useVoerkaI18n } from '@voerkai18n/react';
import { Link } from 'react-router-dom';

export const ListMr = ({
  mrId,
  mr,
  lang,
  articleId,
  mrs,
  defaultShow = false,
}: {
  mrId: number;
  mr: MrData;
  lang: string;
  articleId: number;
  mrs: MrData[];
  defaultShow?: boolean;
}) => {
  const { t } = useVoerkaI18n();
  const [showDiff, setShowDiff] = useState(defaultShow);
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-center">
        <div>
          {mr.title && (
            <div className="text-lg font-semibold text-start">
              <span>{t('article')}: </span>
              <Link className=" text-gray-500 underline capitalize" to={`/${mr.lang}/a/${mr.articleId}`}>
                <span>{mr.title}</span>
              </Link>
            </div>
          )}
          <Link to={`/${lang}/a/${articleId}/mr/${mrId}`} className="text-lg text-gray-500 underline font-semibold">
            <div className="capitalize">MR Id: {mrId}</div>
          </Link>
          <p className="space-x-3">
            {t('language')}: {mr.lang}
          </p>
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
              {t('translated into english deadline')}: {mr.endTranslatedHeight}
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
      <div className="mt-2 flex justify-center items-center rounded-md">
        <button onClick={() => setShowDiff(!showDiff)} className="bg-gray-200 px-4 py-1  mr-5">
          <div className="capitalize">
            {t('show changes')} {showDiff ? '▲' : '▼'}
          </div>
        </button>
      </div>
      {showDiff && <MrShowDiff mrId={mrId} mrs={mrs} />}
    </div>
  );
};

export default ListMr;
