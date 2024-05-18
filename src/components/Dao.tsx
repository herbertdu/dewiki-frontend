import { Staker, Dao, Group } from '../utils/dao';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

const StakerDetails = ({ staker, stakerId }: { staker: Staker; stakerId: string }) => (
  <TreeItem itemId={Math.random().toString()} label={`Staker: ${stakerId}`}>
    <TreeItem itemId={Math.random().toString()} label={`Total Stake: ${staker.totalStake}`} />
    <TreeItem itemId={Math.random().toString()} label={`Unlock Amount: ${staker.unlockAmount}`} />
    <TreeItem itemId={Math.random().toString()} label={`Lock Amount: ${staker.lockAmount}`} />
    <TreeItem itemId={Math.random().toString()} label={`Lock Detail: ${staker.lockDetail}`} />
    <TreeItem itemId={Math.random().toString()} label={`Unfrozen: ${staker.unfrozen}`} />
  </TreeItem>
);

const DaoDetails = ({ daoId, dao, stakerId }: { daoId: string; dao: Dao; stakerId: string }) => {
  if (stakerId !== '' && !dao.stakers[stakerId]) {
    return <></>;
  }
  return (
    <TreeItem itemId={Math.random().toString()} label={daoId}>
      <p>Total Stake: {dao.totalStake}</p>
      <p>Last Issue: {dao.lastIssue}</p>
      <p>Remain: {dao.remain}</p>
      {stakerId !== '' && <StakerDetails staker={dao.stakers[stakerId]} stakerId={stakerId} />}
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
