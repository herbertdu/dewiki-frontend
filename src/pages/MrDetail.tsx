import React, { FC, useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { parseNumber } from '../utils/component';
import NotFound from './NotFound';
import { getLangVersion, MrData } from '../utils/article';
import ListMr from '../components/ListMr';
import { Link } from 'react-router-dom';
import { useVoerkaI18n } from '@voerkai18n/react';

export const MrDetail: FC = () => {
  let { lang = 'en', id, mrId } = useParams();
  const { t } = useVoerkaI18n();
  let parseResult: boolean[] = [];
  let articleId = parseNumber(id, parseResult);
  let parseMrId = parseNumber(mrId, parseResult);
  const [mrs, setMrs] = useState<MrData[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (parseResult.includes(false)) {
      return;
    }
    const fetchMrs = async () => {
      let langVersion = await getLangVersion(articleId, lang);
      setMrs(langVersion.mrs);
      setTitle(langVersion.title);
    };

    fetchMrs();
  }, [articleId, lang]);

  if (parseResult.includes(false)) {
    return <NotFound />;
  }

  return (
    <>
      <Header />
      <div className="text-lg font-semibold text-start">
        <span>{t('article')}: </span>
        <Link className=" text-gray-500 underline capitalize" to={`/${lang}/a/${articleId}`}>
          <span>{title}</span>
        </Link>
      </div>
      <div className="text-lg font-semibold text-start mb-10">
        <span>{t('view')} </span>
        <Link className=" text-gray-500 underline" to={`/${lang}/a/${articleId}/mr`}>
          <span>{t('all mr')}</span>
        </Link>
      </div>
      {mrs.length > (parseMrId - 1) && (
        <ListMr
          mrId={parseMrId}
          mr={mrs[parseMrId - 1]}
          lang={lang}
          articleId={articleId}
          mrs={mrs}
          key={parseMrId}
          defaultShow={true}
        />
      )}
      <Footer />
    </>
  );
};

export default MrDetail;
