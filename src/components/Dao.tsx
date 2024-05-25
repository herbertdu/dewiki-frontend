import { FC } from 'react';
import { Staker, Dao, Group } from '../utils/dao';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useVoerkaI18n } from '@voerkai18n/react';

const StakerDetails = ({ staker }: { staker: Staker }) => (
  <>
    <TreeItem itemId={Math.random().toString()} label={`Total Stake: ${staker.totalStake}`} />
    <TreeItem itemId={Math.random().toString()} label={`Unlock Amount: ${staker.unlockAmount}`} />
    <TreeItem itemId={Math.random().toString()} label={`Lock Amount: ${staker.lockAmount}`} />
    <TreeItem itemId={Math.random().toString()} label={`Lock Detail: ${staker.lockDetail}`} />
    <TreeItem itemId={Math.random().toString()} label={`Unfrozen: ${staker.unfrozen}`} />
  </>
);

const DaoDetails = ({ daoId, dao, stakerId }: { daoId: string; dao: Dao; stakerId: string }) => {
  if (stakerId !== '' && !dao.stakers[stakerId]) {
    return <></>;
  }
  return (
    <TreeItem itemId={dao.daoId} label={daoId}>
      {stakerId == '' && (
        <>
          <p>Total Stake: {dao.totalStake}</p>
          <p>Last Issue: {dao.lastIssue}</p>
          <p>Remain: {dao.remain}</p>
        </>
      )}
      {stakerId !== '' && <StakerDetails staker={dao.stakers[stakerId]} />}
    </TreeItem>
  );
};

export const GroupDetails = ({ group, groups, stakerId }: { group: Group; groups: Group[]; stakerId: string }) => {
  return (
    <TreeItem itemId={group.info.groupId.toString()} label={`Group: ${group.info.name}`}>
      {Object.entries(group.daos).map(([daoId, dao]) => (
        <DaoDetails key={daoId} daoId={daoId} dao={dao} stakerId={stakerId} />
      ))}
      {groups
        .filter((g) => g.info.father === group.info.groupId)
        .map((childGroup) => (
          <GroupDetails key={childGroup.info.name} group={childGroup} groups={groups} stakerId={stakerId} />
        ))}
    </TreeItem>
  );
};

const findParentGroups = (groupId: number, groups: Group[]): string[] => {
  const parents = [];
  let current = groups.find((group) => group.info.groupId === groupId);

  while (current && current.info.father !== 0) {
    const nextId = current.info.father;
    const nextGroup = groups.find((group) => group.info.groupId === nextId);
    if (nextGroup) {
      parents.push(nextGroup.info.groupId.toString());
      current = nextGroup;
    } else {
      break;
    }
  }

  return parents;
};

interface DaoDataProps {
  title: string;
  groups: Group[];
  selectedDao?: string;
  stakerId?: string;
}

export const DaoData: FC<DaoDataProps> = ({ title, groups, selectedDao, stakerId = '' }) => {
  const { t } = useVoerkaI18n();

  let expanded = ['1', '3', '4'];
  if (selectedDao) {
    let selectedGroup = selectedDao.split('-')[0];
    const parentNodes = findParentGroups(parseInt(selectedGroup), groups);
    expanded = parentNodes;
    expanded.push(selectedGroup);
    expanded.push(selectedDao);
  }

  return (
    <div className="w-full sm:w-1/2 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-start space-x-4 mb-3">
      <div className="flex-1 z-0 overflow-hidden">
        <h2 className="text-xl font-medium text-black capitalize">{title}</h2>
        {groups.length > 0 && (
          <SimpleTreeView defaultExpandedItems={expanded} selectedItems={selectedDao?.toString()}>
            {groups
              .filter((group) => group.info.father === 0)
              .map((group, index) => (
                <GroupDetails key={index} group={group} groups={groups} stakerId={stakerId} />
              ))}
          </SimpleTreeView>
        )}
      </div>
    </div>
  );
};
