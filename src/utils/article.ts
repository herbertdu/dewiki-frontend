import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { isContainAction } from './message';
import { diff_match_patch } from 'diff-match-patch';

function mergeMrs(langVersion: { merged: any; mrs: { [x: string]: { changes: any } } }) {
    const dmp = new diff_match_patch();
    dmp.Match_Threshold = 0.1;
    let content = '';
    for (let mrId of langVersion.merged) {
        let changes = langVersion.mrs[mrId - 1].changes;
        content = dmp.patch_apply(dmp.patch_fromText(changes), content)[0];
    }
    return content;
}

export async function getArticle(articleId: number, lang: string): Promise<any> {
    const { Messages, Error } = await dryrun({
        process: DEWIKI_PROCESS,
        tags: [{ name: 'Action', value: 'GetLanguageVersion' }],
        data: JSON.stringify({ articleId: articleId, lang: lang }),
    });
    let article = { title: '', content: '' };
    if (isContainAction(Messages, 'ReceiveLanguageVersion')) {
        let langVersion = JSON.parse(Messages[0].Data);
        article.title = langVersion.title;
        article.content = mergeMrs(langVersion);
    } else {
        alert('Error: ' + Error);
    }
    return article;
}
