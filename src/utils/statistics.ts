import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { isContainAction } from './message';
import { formatDwk } from './fund'

export interface IssueData {
  PerIssue: string;
  LastAdjustRate: number;
  RemainIssueVaultBalance: string;
  VaultBalance: string;
  PeriodRewardTotal: string;
  PeriodIssueTotal: string;
  LastAdjustPerIssueHeight: number;
  CurrentBlockHeight: number;
}

const balKeys: (keyof IssueData)[] = [
  'PerIssue',
  'RemainIssueVaultBalance',
  'VaultBalance',
  'PeriodRewardTotal',
  'PeriodIssueTotal',
];

function formatIssueData(issueData: any) {
  balKeys.map((key) => {
    issueData[key] = formatDwk(issueData[key])
  });
}

export async function getIssueData(): Promise<any> {
  const { Messages, Error } = await dryrun({
    process: DEWIKI_PROCESS,
    tags: [{ name: 'Action', value: 'IssueData' }],
  });
  let issueData = {};
  if (isContainAction(Messages, 'ReceiveIssueData')) {
    issueData = JSON.parse(Messages[0].Data);
    formatIssueData(issueData);
  } else {
    alert('Error: ' + Error);
  }
  return issueData;
}
