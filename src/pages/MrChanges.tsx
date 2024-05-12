import React, { FC, useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { parseNumber } from '../utils/component';
import NotFound from './NotFound';
import { getLangVersion, MrData} from '../utils/article';
import { MrShowDiff } from '../components/MrShowDiff';

export const MrChanges: FC = () => {
  let { lang = 'en', id, mrId } = useParams();
  let parseResult: boolean[] = [];
  let articleId = parseNumber(id, parseResult);
  let parseMrId = parseNumber(mrId, parseResult);
  const [mrs, setMrs] = useState<MrData[]>([]);

  useEffect(() => {
    if (parseResult.includes(false)) {
      return;
    }
    const fetchMrs = async () => {
      let langVersion = await getLangVersion(articleId, lang);
      setMrs(langVersion.mrs);
    };

    fetchMrs();
  }, [articleId, lang]);
  if (parseResult.includes(false)) {
    return <NotFound />;
  }

  return (
    <>
      <Header />
      <MrShowDiff mrId={parseMrId} mrs={mrs} />
      <Footer />
    </>
  );
};
