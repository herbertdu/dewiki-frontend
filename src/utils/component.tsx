import { ComponentType } from "react";
import NotFound from "../pages/NotFound";
import { useParams } from "react-router-dom";

function processParams(Component: ComponentType<{ articleId: number, lang: string }>) {
    return function() {
        let { lang = 'en', id } = useParams();
        if (!id || !/^\d+$/.test(id)) {
            return <NotFound />;
        }
        let articleId = parseInt(id);
        if (isNaN(articleId)) {
            return <NotFound />;
        }
        return <Component articleId={articleId} lang={lang} />;
    }
}

export default processParams;