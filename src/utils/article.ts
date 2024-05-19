import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { isContainAction } from './message';
import { diff_match_patch } from 'diff-match-patch';
import { CHAR_LANGS } from '../constants/env';

export interface MrData {
  state: string;
  baseMr: number;
  editor: string;
  reward: string;
  freeze: string;
  startHeight: number;
  endHeight: number;
  wordCount: number;
  editSummary: string;
  changes: string;
  editType: string;
  translationProgress: string;
  endTranslatedHeight: number;
  freezeForBeTranslated: string;
  createTimestamp: number;
  appeals: number[];
  guaranteedId: number;
  // following add from frontend
  articleId: number;
  lang: string;
  mrId: number;
  title: string;
}

export interface ArticleData {
  title: string;
  content: string;
  latestMr: number;
  meta: any;
}

const dmp = new diff_match_patch();
dmp.Match_Threshold = 0.1;

function mergeMrs(langVersion: { mrs: { [x: string]: { changes: any } } }, article: any) {
  let content = '';
  let latestMr = 0;
  for (let idx in langVersion.mrs) {
    let changes = langVersion.mrs[idx].changes;
    content = dmp.patch_apply(dmp.patch_fromText(changes), content)[0];
    let mrId = parseInt(idx) + 1;
    latestMr = mrId;
  }
  article.latestMr = latestMr;
  return content;
}

export async function getArticle(articleId: number, lang: string): Promise<ArticleData> {
  const { Messages, Error } = await dryrun({
    process: DEWIKI_PROCESS,
    tags: [{ name: 'Action', value: 'GetLanguageVersion' }],
    data: JSON.stringify({ articleId: articleId, lang: lang }),
  });
  let article = { title: '', content: '', latestMr: 0, meta: {} };
  if (isContainAction(Messages, 'ReceiveLanguageVersion')) {
    let data = JSON.parse(Messages[0].Data);
    let langVersion = data.versionData;
    article.title = langVersion.title;
    article.content = mergeMrs(langVersion, article);
    article.meta = data.meta;
  } else {
    alert('Error: ' + Error);
  }
  return article;
}

export async function getLangVersion(articleId: number, lang: string): Promise<any> {
  const { Messages, Error } = await dryrun({
    process: DEWIKI_PROCESS,
    tags: [{ name: 'Action', value: 'GetLanguageVersion' }],
    data: JSON.stringify({ articleId: articleId, lang: lang }),
  });
  if (isContainAction(Messages, 'ReceiveLanguageVersion')) {
    let langVersion = JSON.parse(Messages[0].Data).versionData;
    return langVersion;
  } else {
    alert('Error: ' + Error);
  }
  return [];
}

export function getChanges(oldContent: string, newContent: string): string {
  const dmp = new diff_match_patch();
  dmp.Match_Threshold = 0.1;
  const patches = dmp.patch_make(oldContent, newContent);
  return dmp.patch_toText(patches);
}

export function countWords(str: string, lang: string = 'en'): number {
  if (str === '') {
    return 0;
  }
  if (CHAR_LANGS.includes(lang)) {
    return str.length - 1;
  } else {
    return str.split(/\s+/).length - 1;
  }
}

export function getOldAndNewContent(mrId: number, mrs: MrData[]) {
  if (mrs.length === 0) {
    return { oldContent: '', newContent: '' };
  }
  let oldContent = '';
  for (let idx in mrs) {
    let changes = mrs[idx].changes;
    oldContent = dmp.patch_apply(dmp.patch_fromText(changes), oldContent)[0];
    let mergedMrId = parseInt(idx) + 1;
    if (mergedMrId === mrId - 1) {
      break;
    }
  }
  let newContent = dmp.patch_apply(dmp.patch_fromText(mrs[mrId - 1].changes), oldContent)[0];
  return { oldContent, newContent };
}
