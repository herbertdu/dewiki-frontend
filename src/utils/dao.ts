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
