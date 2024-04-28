import { HashRouter, Routes, Route, useParams } from 'react-router-dom';

import Home from './pages/Home';
import Article from './components/Article';
import NotFound from './pages/NotFound';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path={'/'} element={<Home />} />
                <Route path={'/a/:id'} element={<ArticleWithParams />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
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
