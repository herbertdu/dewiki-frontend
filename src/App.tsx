import { HashRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import { ArticleWithParams } from './pages/Article';
import NotFound from './pages/NotFound';
import { i18nScope } from './languages';
import { VoerkaI18nProvider } from '@voerkai18n/react';
import React from 'react';
import CategoryPage from './pages/CategoryPage';
import { EditWithParams } from './pages/Edit';

function App() {
    return (
        <VoerkaI18nProvider fallback={<div>Loading the language pack...</div>} scope={i18nScope}>
            <HashRouter>
                <Routes>
                    <Route path={'/:lang?'} element={<Home />} />
                    <Route path={'/:lang/a/:id'} element={<ArticleWithParams />} />
                    <Route path={'/:lang/a/:id/edit'} element={<EditWithParams />} />
                    <Route path={'/:lang/categories'} element={<CategoryPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </HashRouter>
        </VoerkaI18nProvider>
    );
}

export default App;
