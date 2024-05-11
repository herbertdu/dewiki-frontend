import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { isContainAction } from './message';
import { diff_match_patch } from 'diff-match-patch';

function mergeMrs(langVersion: { mrs: { [x: string]: { changes: any } } }, article: any) {
    const dmp = new diff_match_patch();
    dmp.Match_Threshold = 0.1;
    let content = '';
    let latestMr = 0;
    for (let idx in langVersion.mrs) {
        let changes = langVersion.mrs[idx].changes;
        content = dmp.patch_apply(dmp.patch_fromText(changes), content)[0];
        let mrId = parseInt(idx) + 1
        latestMr = mrId;
    }
    article.latestMr = latestMr
    return content;
}

export async function getArticle(articleId: number, lang: string): Promise<any> {
    const { Messages, Error } = await dryrun({
        process: DEWIKI_PROCESS,
        tags: [{ name: 'Action', value: 'GetLanguageVersion' }],
        data: JSON.stringify({ articleId: articleId, lang: lang }),
    });
    let article = { title: '', content: '', latestMr: 0 };
    if (isContainAction(Messages, 'ReceiveLanguageVersion')) {
        let langVersion = JSON.parse(Messages[0].Data).versionData;
        article.title = langVersion.title;
        article.content = mergeMrs(langVersion, article);
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
    if (['en'].includes(lang)) {
        return str.split(/\s+/).length - 1;
    } else if (['zh', 'ja'].includes(lang)) {
        return str.length - 1;
    }
    return 0;
}
