import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { getAddr, isContainAction } from './message';
import { MrData } from './article';
import { formatDwk } from './fund'

export interface UserData {
  balance: string;
  userMrs: MrData[];
}

function elevateMrData(data: any) {
    return data.map((item: any) => {
        return {
            ...item,
            ...item.mrData,
            mrData: undefined
        };
    });
}

function formatUserData(userData: UserData) {
  let newUserData = JSON.parse(JSON.stringify(userData));
  newUserData.balance = formatDwk(userData.balance)
  newUserData.userMrs = elevateMrData(newUserData.userMrs)
  return newUserData;
}

export async function getUserData(address?: string): Promise<any> {
  if (!address) {
    address = await getAddr();
  }
  const { Messages, Error } = await dryrun({
    process: DEWIKI_PROCESS,
    tags: [{ name: 'Action', value: 'GetUserData' }],
    data: JSON.stringify({ user: address, userMrsNum: 100 }),
  });
  if (isContainAction(Messages, 'ReceiveUserData')) {
    let userData = JSON.parse(Messages[0].Data);
    userData = formatUserData(userData)
    return userData;
  } else {
    alert('Error: ' + Error);
  }
  return {};
}
