import { DEWIKI_PROCESS } from '../constants/env';
import { message, createDataItemSigner, result } from '@permaweb/aoconnect';

export function isContainAction(Messages: any[], actionValue: string) {
    if (Messages.length === 0) {
        return false;
    }
    let arr = Messages[0].Tags;
    let val = JSON.stringify({ value: actionValue, name: 'Action' });
    return arr.some((arrVal: any) => JSON.stringify(arrVal) === val);
}

export async function sendMessage(action: string, data: any, resultAction: string = '') {
    const messageId = await message({
        process: DEWIKI_PROCESS,
        tags: [{ name: 'Action', value: action }],
        signer: createDataItemSigner(window.arweaveWallet),
        data: JSON.stringify(data),
    });

    console.log(`messageId: ${messageId} wallet: ${window.arweaveWallet.getActiveAddress()} action: ${action}`);
    let { Messages, Spawns, Output, Error } = await result({
        message: messageId,
        process: DEWIKI_PROCESS,
    });
    if (Spawns && Spawns.length > 0) console.log(Spawns);
    if (Output && Output.length > 0) console.log(Output);
    if (Error) console.log(Error);

    if (resultAction) {
        if (!isContainAction(Messages, resultAction)) {
            alert('Error: ' + Error);
        }
    }
    return Messages;
}

export async function getAddr() {
    if (!(window && window.arweaveWallet)) {
        return '';
    }

    const permissions = await window.arweaveWallet.getPermissions();
    if (permissions.includes('ACCESS_ADDRESS')) {
        const address = await window.arweaveWallet.getActiveAddress();
        return address;
    }
    return '';
}
