import { HashRouter, Routes, Route, useParams } from 'react-router-dom';

import Home from './pages/Home';
import Article from './components/Article';
import NotFound from './pages/NotFound';
import { i18nScope } from './languages';
import { VoerkaI18nProvider } from '@voerkai18n/react';

function App() {
    return (
        <VoerkaI18nProvider fallback={<div>Loading the language pack...</div>} scope={i18nScope}>
            <HashRouter>
                <Routes>
                    <Route path={'/'} element={<Home />} />
                    <Route path={'/a/:id'} element={<ArticleWithParams />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </HashRouter>
        </VoerkaI18nProvider>
    );
}

function ArticleWithParams() {
    let { id } = useParams();
    if (!id) {
        return <NotFound />;
    }
    let articleId = parseInt(id);
    if (isNaN(articleId)) {
        return <NotFound />;
    }
    return <Article articleId={articleId} lang="en" />;
}

export default App;
