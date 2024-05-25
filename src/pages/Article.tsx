import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createStyles, makeStyles } from '@mui/styles';
import MarkdownNavbar from '../utils/markdown-navbar/index';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import './customKatex.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { getArticle, ArticleData } from '../utils/article';

import { Affix } from 'antd';
import 'github-markdown-css';
import '../utils/markdown-navbar/navbar.css';
import process2Params from '../utils/component';
import Header from '../components/Header';
import { useVoerkaI18n } from '@voerkai18n/react';
import Footer from '../components/Footer';
import { Group, getGroups } from '../utils/dao';
import { getCategories, Category } from '../utils/category';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      flexGrow: 1,
      // padding: theme.spacing(4),
      // paddingBottom: theme.spacing(3),
      // paddingTop: theme.spacing(12),
      padding: 4,
      paddingBottom: 3,
      paddingTop: 12,
      minHeight: 'calc(100% - 120px)',
    },
    drawer: {
      flexShrink: 0,
      width: 296,
      '& svg': {
        fontSize: '1.5rem',
      },
    },
    paper: {
      width: 296,
      overflowY: 'hidden',
    },
  })
) as () => Record<'main' | 'drawer' | 'paper', string>;

const Article = ({ articleId, lang }: { articleId: number; lang: string }) => {
  const classes = useStyles();
  const [article, setArticle] = useState<ArticleData>();
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const { t } = useVoerkaI18n();

  let markdownBoxWidth = '70%';
  if (isMobile) {
    markdownBoxWidth = '93%';
  }

  const handleDrawerOpen = (event: React.MouseEvent) => {
    event.stopPropagation(); // To avoid triggering the handleDrawerClick function
    setOpen(true);
  };

  const handleDrawerClose = (event: React.MouseEvent) => {
    event.stopPropagation(); // To avoid triggering the handleDrawerClick function
    setOpen(false);
  };

  const handleDrawerClick = (event: React.MouseEvent) => {
    if (isMobile && !(event.target as HTMLElement).closest('.drawer')) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      let categories = await getCategories();
      setCategories(categories);

      const feGroups = await getGroups();
      setGroups(feGroups);

      let feArticle = await getArticle(articleId, lang);
      setArticle(feArticle);
      document.title = `${feArticle.title} | DeWiki`;
    };

    fetch();
  }, [articleId, lang]);

  if (!article) {
    return <div>Loading...</div>;
  }

  let isLatest = article.meta.latest.includes(lang);

  const codeRenderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');

      return !inline && match ? (
        <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div onClick={handleDrawerClick}>
      <Header />
      <Affix offsetTop={5}>
        <IconButton
          color="inherit"
          aria-label={open ? 'close drawer' : 'open drawer'}
          edge="start"
          onClick={open ? handleDrawerClose : handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          className={`${classes.drawer} drawer`}
          variant={open ? 'permanent' : 'temporary'}
          classes={{ paper: classes.paper }}
        >
          <IconButton
            color="inherit"
            aria-label={open ? 'close drawer' : 'open drawer'}
            edge="start"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
          >
            <CloseIcon />
          </IconButton>
          <Box>
            <MarkdownNavbar
              className="article"
              source={article.content}
              headingTopOffset={40} //The distance from the top
              ordered={false} //Does it display the title numbers 1, 2, etc.
              updateHashAuto={false} // Automatically update the hash value of browser address when page scrolling if true
              updateHashOnClick={false}
            />
          </Box>
        </Drawer>
      </Affix>
      <main className={classes.main}>
        <h1 className="text-center font-bold text-5xl mb-5 capitalize">{article.title}</h1>
        <div className="text-sm text-gray-400 text-center">
          <Link to={`/${lang}/a/${articleId}/edit`} className="underline text-gray-500">
            <span>{t('edit')}</span>
          </Link>

          <span className="ml-2 mr-2">|</span>
          <Link to={`/${lang}/a/${articleId}/mr`} className="underline text-gray-500">
            <span>{t('history')}</span>
          </Link>

          <span className="ml-2 mr-2">|</span>
          <span>{t('DAO')} </span>
          <Link to={`/${lang}/stake/${article.meta.group}/${lang}`} className="underline text-gray-500">
            <span>{groups.length > 0 ? groups[article.meta.group - 1].info.name : article.meta.group}</span>
          </Link>

          <span className="ml-2 mr-2">|</span>
          <span>{t('category')} </span>
          <Link to={`/${lang}/categories/${article.meta.category}`} className="underline text-gray-500">
            <span>{categories.length > 0 ? categories[article.meta.category - 1].names[lang]: article.meta.category}</span>
          </Link>
        </div>
        <div className="text-sm text-gray-400 text-center mb-10">
          {t('state')}: {isLatest ? t('latest') : t('behind')}
          <span> [ </span>
          {article.meta.latest.map((lg: string) => (
            <>
              <Link key={lg} to={`/${lg}/a/${articleId}`} className="underline text-gray-500">
                {lg}
              </Link>
              <span> </span>
            </>
          ))}
          <span>]</span>
        </div>
        <Grid container justifyContent="center" alignItems="center">
          <Box width={markdownBoxWidth}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              className={'markdown-body'}
              components={codeRenderers}
            >
              {article.content}
            </ReactMarkdown>
          </Box>
        </Grid>
      </main>
      <Footer />
    </div>
  );
};

export const ArticleWithParams = process2Params(Article);

export default Article;
