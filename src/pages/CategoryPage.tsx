import React, { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCategories, Category } from '../utils/category';
import Header from '../components/Header';
import { useVoerkaI18n } from '@voerkai18n/react';
import Footer from '../components/Footer';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { parseNumber } from '../utils/component';

interface ArticleLink {
  articleTitle: string;
  url: string;
}

interface CategoryIndex {
  categoryId: number;
  father: number;
  categoryName: string;
  articles: any;
  level: number;
  articleLinks: ArticleLink[];
  [key: number]: any;
}

const ArticleDetails = ({ articleLink }: { articleLink: ArticleLink }) => {
  if (articleLink) {
    return (
      <p key={articleLink.url} style={{ marginLeft: '20px', color: '#666' }}>
        <a href={articleLink.url} style={{ color: '#007BFF', textDecoration: 'none' }}>
          {articleLink.articleTitle}
        </a>
      </p>
    );
  } else {
    return <></>;
  }
};

export const CategoryDetails = ({ category, categories }: { category: CategoryIndex; categories: CategoryIndex[] }) => {
  return (
    <TreeItem itemId={category.categoryId.toString()} label={`${category.categoryName}`}>
      {Object.entries(category.articleLinks).map(([articleIdx, articleLink]) => (
        <ArticleDetails key={articleIdx} articleLink={articleLink} />
      ))}
      {categories
        .filter((c) => c.father === category.categoryId)
        .map((childCategory) => (
          <CategoryDetails key={childCategory.categoryName} category={childCategory} categories={categories} />
        ))}
    </TreeItem>
  );
};

const findParentCategories = (categoryId: number, categories: CategoryIndex[]): string[] => {
  const parents = [];
  let current = categories.find((category) => category.categoryId === categoryId);

  while (current && current.father !== 0) {
    const nextId = current.father;
    const nextGroup = categories.find((category) => category.categoryId === nextId);
    if (nextGroup) {
      parents.push(nextGroup.categoryId.toString());
      current = nextGroup;
    } else {
      break;
    }
  }

  return parents;
};

const CategoryPage: FC = () => {
  let {lang = 'en', categoryId, articleId } = useParams();
  let parseResult: boolean[] = [];
  let parseGroupId = parseNumber(categoryId, parseResult);

  const [categories, setCategories] = useState<Category[]>([]);
  const { t } = useVoerkaI18n();

  useEffect(() => {
    const fetchCategories = async () => {
      let categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  let categoryIndex: CategoryIndex[] = categories.map((category, index) => {
    let categoryName = category.names[lang];
    let articles = category.articles;
    let categoryId = index + 1;
    let father = category.father;
    let articleLinks = Object.keys(articles).map((articleId) => {
      let articleTitle = articles[articleId][lang]; // Select the article title based on the current language
      let url = `#/${lang}/a/${articleId}`; // Generate the URL of the article

      return { articleTitle, url };
    });
    return { categoryName, articles, level: category.father, categoryId, father, articleLinks };
  });

  let expanded = Array.from({length: categoryIndex.length}, (_, i) => (i + 1).toString());
  let selectedCategory = '';
  if (parseGroupId != 0) {
    const parentNodes = findParentCategories(parseGroupId, categoryIndex);
    expanded = parentNodes;
    expanded.push(parseGroupId.toString());

    selectedCategory = parseGroupId.toString();
  }

  return (
    <div>
      <Header />
      <div className="text-lg text-gray-500 underline font-semibold text-start mb-10">
        <Link to={`/${lang}/createArticle`}>
          <div>{t('Create new article')}</div>
        </Link>
        <Link to={`/${lang}/createLangVersion`}>
          <div>{t('Create new language version')}</div>
        </Link>
      </div>

      <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
        {categoryIndex.length > 0 && (
          <SimpleTreeView defaultExpandedItems={expanded} selectedItems={selectedCategory}>
            {categoryIndex
              .filter((category) => category.father === 0)
              .map((category, index) => (
                <CategoryDetails key={index} category={category} categories={categoryIndex} />
              ))}
          </SimpleTreeView>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
