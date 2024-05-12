import { HashRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import { ArticleWithParams } from './pages/Article';
import NotFound from './pages/NotFound';
import { i18nScope } from './languages';
import { VoerkaI18nProvider } from '@voerkai18n/react';
import React from 'react';
import CategoryPage from './pages/CategoryPage';
import { EditWithParams } from './pages/Edit';
import CreateArticle from './pages/CreateArticle';
import CreateLangVersion from './pages/CreateLangVersion';
import {MrWithParams} from './pages/Mr';
import Stake from './pages/Stake';
import {MrChanges} from './pages/MrChanges';

function App() {
    return (
        <VoerkaI18nProvider fallback={<div>Loading the language pack...</div>} scope={i18nScope}>
            <HashRouter>
                <Routes>
                    <Route path={'/:lang?'} element={<Home />} />
                    <Route path={'/:lang/a/:id'} element={<ArticleWithParams />} />
                    <Route path={'/:lang/a/:id/edit'} element={<EditWithParams />} />
                    <Route path={'/:lang/a/:id/mr'} element={<MrWithParams />} />
                    <Route path={'/:lang/a/:id/mr/:mrId'} element={<MrChanges />} />
                    <Route path={'/:lang/categories'} element={<CategoryPage />} />
                    <Route path={'/:lang/createArticle'} element={<CreateArticle />} />
                    <Route path={'/:lang/createLangVersion'} element={<CreateLangVersion />} />
                    <Route path={'/:lang/stake'} element={<Stake />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </HashRouter>
        </VoerkaI18nProvider>
    );
}

export default App;
