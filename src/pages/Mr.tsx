import { useEffect, useState } from 'react';
import { getLangVersion, MrData } from '../utils/article';
import process2Params from '../utils/component';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import ListMr from '../components/ListMr';

const Mr = ({ articleId, lang }: { articleId: number; lang: string }) => {
  const [mrs, setMrs] = useState<MrData[]>([]);
  const [title, setTitle] = useState('');

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
        {mrs &&
          [...mrs]
            .reverse()
            .map((mr, index) => (
              <ListMr
                mrId={mrs.length - index}
                mr={mr}
                lang={lang}
                articleId={articleId}
                mrs={mrs}
                key={mrs.length - index}
              />
            ))}
      </div>
      <Footer />
    </>
  );
};

export default Mr;

export const MrWithParams = process2Params(Mr);
