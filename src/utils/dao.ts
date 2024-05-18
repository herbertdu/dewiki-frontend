import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { isContainAction } from './message';
import { formatDwk, formatLockDetail } from '../utils/fund';
import Decimal from 'decimal.js';

export interface Staker {
  totalStake: string;
  unlockAmount: string;
  unfrozen: string;
  lockDetail: [number, string][];
  lockAmount: string;
}

export interface Dao {
  daoId: string;
  stakers: Record<string, Staker>;
  totalStake: string;
  lastIssue: string;
  remain: string;
}

export interface Group {
  info: {
    groupId: number;
    father: number;
    isLeaf: boolean;
    name: string;
  };
  daos: Record<string, Dao>;
}

export async function getAllStakeInfo(addr: string): Promise<any> {
  const { Messages, Error } = await dryrun({
    process: DEWIKI_PROCESS,
    tags: [{ name: 'Action', value: 'AllStakeInfo' }],
    data: JSON.stringify({ target: addr }),
  });
  if (isContainAction(Messages, 'ReceiveAllStakeInfo')) {
    let allStakeInfo = JSON.parse(Messages[0].Data);
    return allStakeInfo;
  } else {
    alert('Error: ' + Error);
  }
  return [];
}

function formatGroups(groups: Group[]): Group[] {
  let newGroups = groups.map((group: any, index: any) => ({
    ...group,
    info: { ...group.info, groupId: index + 1 },
  }));
  for (let group of newGroups) {
    for (let daoName in group.daos) {
      let dao = group.daos[daoName];
      let daoId = `${group.info.groupId}-${daoName}`;
      dao.daoId = daoId;
      dao.totalStake = formatDwk(dao.totalStake);
      dao.lastIssue = formatDwk(dao.lastIssue);
      dao.remain = formatDwk(dao.remain);
    }
  }
  return newGroups;
}

export async function getGroups(): Promise<any> {
  const { Messages, Error } = await dryrun({
    process: DEWIKI_PROCESS,
    tags: [{ name: 'Action', value: 'Groups' }],
  });
  if (isContainAction(Messages, 'ReceiveGroups')) {
    let groups = JSON.parse(Messages[0].Data);
    let newGroups = formatGroups(groups);
    return newGroups;
  } else {
    alert('Error: ' + Error);
  }
  return [];
}

export async function getGroupsAndStakeInfo(addr: string): Promise<any> {
  let allStakeInfo = await getAllStakeInfo(addr);
  let groups = await getGroups();
  for (let group of groups) {
    for (let daoName in group.daos) {
      let daoId = `${group.info.groupId}-${daoName}`;
      let stakeInfo = allStakeInfo[daoId];
      group.daos[daoName].stakers = {};
      if (stakeInfo) {
        stakeInfo.lockAmount = formatDwk(stakeInfo.lockAmount);
        stakeInfo.unlockAmount = formatDwk(stakeInfo.unlockAmount);
        stakeInfo.unfrozen = formatDwk(stakeInfo.unfrozen);
        stakeInfo.lockDetail = formatLockDetail(stakeInfo.lockDetail)
        stakeInfo.totalStake = new Decimal(stakeInfo.lockAmount).plus(new Decimal(stakeInfo.unlockAmount))
        group.daos[daoName].stakers[addr] = stakeInfo;
      }
    }
  }
  return groups;
}
