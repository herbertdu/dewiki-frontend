import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCategories } from '../utils/category';
import Header from '../components/Header';
import { useVoerkaI18n } from '@voerkai18n/react';
import Footer from '../components/Footer';

const CategoryPage = () => {
    let { lang = 'en' } = useParams();
    const [categories, setCategories] = useState([]);
    const { activeLanguage, changeLanguage, languages} = useVoerkaI18n();
    const langs = languages.map((language) => language.name);

    useEffect(() => {
        if (lang !== activeLanguage && langs.includes(lang)) {
            changeLanguage(lang);
        }
        const fetchCategories = async () => {
            let categories = await getCategories();
            setCategories(categories);
        };
        fetchCategories();
    }, [lang]);

    let categoryIndex = categories.map((category) => {
        let categoryName = category.names[lang];
        let articles = category.articles;
        let articleLinks = Object.keys(articles).map((articleId) => {
            let articleTitle = articles[articleId][lang]; // Select the article title based on the current language
            let url = `#/${lang}/a/${articleId}`; // Generate the URL of the article

            return { articleTitle, url };
        });
        return { categoryName, articleLinks, level: category.father };
    });

    return (
        <div>
            <Header />
            <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
                {categoryIndex.map((category, index) => (
                    <div
                        key={index}
                        style={{
                            marginLeft: `${category.level * 20}px`,
                            borderLeft: '2px solid #ddd',
                            paddingLeft: '10px',
                        }}
                    >
                        <h2 style={{ color: '#444', borderBottom: '1px solid #ddd' }}>{category.categoryName}</h2>
                        {category.articleLinks.map((article, index) => (
                            <p key={index} style={{ marginLeft: '20px', color: '#666' }}>
                                <a href={article.url} style={{ color: '#007BFF', textDecoration: 'none' }}>
                                    {article.articleTitle}
                                </a>
                            </p>
                        ))}
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default CategoryPage;
