import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { isContainAction } from './message';

export async function getCategories(): Promise<any> {
    const { Messages, Error } = await dryrun({
        process: DEWIKI_PROCESS,
        tags: [{ name: 'Action', value: 'GetCategories' }],
    });
    let categories = {};
    if (isContainAction(Messages, 'ReceiveCategories')) {
        categories = JSON.parse(Messages[0].Data);
    } else {
        alert('Error: ' + Error);
    }
    return categories;
}
