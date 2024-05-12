import { ComponentType } from 'react';
import NotFound from '../pages/NotFound';
import { useParams } from 'react-router-dom';

export function parseNumber(str: string | undefined, parseResult: boolean[]) {
    if (!str || !/^\d+$/.test(str)) {
        parseResult.push(false);
        return 0
    }
    let num = parseInt(str);
    if (isNaN(num)) {
                parseResult.push(false);
        return 0
    }
    return num
}

function process2Params(Component: ComponentType<{ articleId: number; lang: string }>) {
    return function () {
        let { lang = 'en', id } = useParams();
        let parseResult: boolean[] = []
        let articleId = parseNumber(id, parseResult);
        if (parseResult.includes(false)) {
            return <NotFound />;
        }
        return <Component articleId={articleId} lang={lang} />;
    };
}

export default process2Params;
