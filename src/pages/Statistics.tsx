import React, { FC, useState, useEffect } from 'react';
import { getIssueData, IssueData } from '../utils/statistics';
import { useVoerkaI18n } from '@voerkai18n/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Group, getGroups } from '../utils/dao';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { GroupDetails } from '../components/Dao';

export const Statistics: FC = () => {
  const [issueData, setIssueData] = useState<IssueData | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const { t } = useVoerkaI18n();

  useEffect(() => {
    async function fetchData() {
      const data = await getIssueData();
      setIssueData(data);

      const feGroups = await getGroups();
      setGroups(feGroups);
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
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/2 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 mb-3">
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

        <div className="w-full sm:w-1/2 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-start space-x-4 mb-3">
          <div className="flex-1 z-0 overflow-hidden">
            <h2 className="text-xl font-medium text-black capitalize">{t('DAO data')}</h2>
            {groups.length > 0 && (
              <SimpleTreeView defaultExpandedItems={['1','3', '4']}>
                {groups
                  .filter((group) => group.info.father === 0)
                  .map((group, index) => (
                    <GroupDetails key={index} group={group} groups={groups} stakerId="" />
                  ))}
              </SimpleTreeView>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Statistics;
