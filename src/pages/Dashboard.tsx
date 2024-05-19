import React, { FC, useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import ListMr from '../components/ListMr';
import { useVoerkaI18n } from '@voerkai18n/react';
import { getUserData, UserData } from '../utils/user';

export const Dashboard: FC = () => {
  let { lang = 'en' } = useParams();
  const { t } = useVoerkaI18n();
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    async function fetchData() {
      const feUserData = await getUserData();
      setUserData(feUserData);
    }
    fetchData();
  }, []);

  if (!userData) {
    return <>Loading...</>;
  }

  return (
    <>
      <Header />
      <div className="w-full sm:w-1/2 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 mb-6">
        <div className="flex-1 z-0 overflow-hidden">
          <h2 className="text-xl font-medium text-black capitalize">{t('balance')}</h2>
          <details open className="mt-4 text-gray-700" key="dashboard-balance">
            <summary className="font-semibold bg-gray-200 rounded-md px-3 py-1">DWK</summary>
            <span className="ml-6 text-sm">{userData && userData.balance}</span>
          </details>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-medium text-black capitalize">{t('my mr:')}</h2>
        {userData.userMrs &&
          [...userData.userMrs]
            .reverse()
            .map((mr) => (
              <ListMr
                mrId={mr.mrId}
                mr={mr}
                lang={lang}
                articleId={mr.articleId}
                mrs={userData.userMrs}
                key={`${mr.articleId}-${mr.lang}-${mr.mrId}`}
              />
            ))}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
