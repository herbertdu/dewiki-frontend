import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { isContainAction } from './message';

export interface Staker {
    unlockAmount: string;
    unfrozen: string;
    lockDetail: [number, string][];
    lockAmount: string;
}

export interface Dao {
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

export async function getGroups(): Promise<any> {
    const { Messages, Error } = await dryrun({
        process: DEWIKI_PROCESS,
        tags: [{ name: 'Action', value: 'Groups' }],
    });
    if (isContainAction(Messages, 'ReceiveGroups')) {
        let groups = JSON.parse(Messages[0].Data);
        let newGroups = groups.map((group: any, index: any) => ({
            ...group,
            info: { ...group.info, groupId: index + 1 },
        }));
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
            let daoId = `${group.info.groupId}-${daoName}`
            let stakeInfo = allStakeInfo[daoId];
            group.daos[daoName].stakers = {};
            if (stakeInfo) {
                group.daos[daoName].stakers[addr] = stakeInfo;
            }
        }
    }
    return groups;
}
