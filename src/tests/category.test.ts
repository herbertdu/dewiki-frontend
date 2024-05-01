import CategoryPage from '../pages/CategoryPage';

let categories= [
    { father: 0, articles: {}, introduceArticle: 0, names: { zh: '根分类', en: 'root category' } },
    { father: 1, articles: { '3': { zh: 'Arweave', en: 'Arweave' } }, introduceArticle: 0, names: { zh: 'Web3', en: 'Web3' } },
    {
        father: 2,
        articles: { '1': { zh: '比特币', en: 'bitcoin' } },
        introduceArticle: 0,
        names: { zh: '公链', en: 'chain' },
    },
    { father: 2, articles: {}, introduceArticle: 0, names: { zh: '去中心化金融', en: 'DeFi' } },
    { father: 2, articles: {}, introduceArticle: 0, names: { zh: 'NFTs', en: 'NFTs' } },
    { father: 1, articles:  { '2': { zh: '开发', en: 'develop' } }, introduceArticle: 0, names: { zh: '计算机', en: 'computer' } },
];
