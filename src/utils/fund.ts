import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { getAddr } from './message';
import Decimal from 'decimal.js';

export function formatDwk(dwkStr: string): string {
    const dwk = new Decimal(dwkStr);
    const formattedDwk = dwk.dividedBy(1e12).toString();
    return formattedDwk;
}

export function reverseDwk(formatStr: string): string {
    if (formatStr === '') {
        return '0';
    }
    const dwk = new Decimal(formatStr).times(1e12).toString();
    return dwk;
}

export function formatLockDetail(lockDetail: any): string {
    let newLockDetail = JSON.parse(JSON.stringify(lockDetail));
    newLockDetail.map((lock: any) => (lock[1] = formatDwk(lock[1])));
    return JSON.stringify(newLockDetail);
}

export function formatStakeInfo(stakeInfo: any): string {
    let newStakeInfo = JSON.parse(JSON.stringify(stakeInfo));
    newStakeInfo.lockDetail = JSON.parse(formatLockDetail(newStakeInfo.lockDetail));
    newStakeInfo.unlockAmount = formatDwk(newStakeInfo.unlockAmount);
    newStakeInfo.lockAmount = formatDwk(newStakeInfo.lockAmount);
    newStakeInfo.unfrozen = formatDwk(newStakeInfo.unfrozen);
    return JSON.stringify(newStakeInfo, null, 2);
}

export async function getDwkBalance(): Promise<string> {
    let addr = await getAddr();
    if (addr === '') {
        return '0';
    }
    const { Messages, Error } = await dryrun({
        process: DEWIKI_PROCESS,
        tags: [
            { name: 'Action', value: 'Balance' },
            { name: 'Target', value: addr },
        ],
    });
    let bal = Messages[0].Data;
    return formatDwk(bal);
}
