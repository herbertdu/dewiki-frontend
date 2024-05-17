import React, { FC, useState, useEffect } from 'react';
import { getIssueData, IssueData } from '../utils/statistics';
import { useVoerkaI18n } from '@voerkai18n/react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const Statistics: FC = () => {
  const [issueData, setIssueData] = useState<IssueData | null>(null);
  const { t } = useVoerkaI18n();

  useEffect(() => {
    async function fetchData() {
      const data = await getIssueData();
      setIssueData(data);
    }
    fetchData();
  }, []);

  const orderedKeys: (keyof IssueData)[] = [
    'PerIssue',
    'LastAdjustRate',
    'RemainIssueVaultBalance',
    'VaultBalance',
    'PeriodRewardTotal',
    'PeriodIssueTotal',
    'LastAdjustPerIssueHeight',
    'CurrentBlockHeight',
  ];

  return (
    <>
      <Header />
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div className="flex-1 z-0 overflow-hidden">
          <h2 className="text-xl font-medium text-black capitalize">{t('token issue data')}</h2>
          {orderedKeys.map((key) => (
            <details open className="mt-4 text-gray-700" key={key}>
              <summary className="font-semibold bg-gray-200 rounded-md px-3 py-1">{key}</summary>
              <span className="ml-6 text-sm">{issueData && issueData[key]}</span>
            </details>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Statistics;
