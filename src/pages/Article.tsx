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

import { getArticle, ArticleData } from '../utils/article';

import { Affix } from 'antd';
import 'github-markdown-css';
import '../utils/markdown-navbar/navbar.css';
import process2Params from '../utils/component';
import Header from '../components/Header';
import { useVoerkaI18n } from '@voerkai18n/react';
import Footer from '../components/Footer';

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
    const fetchArticle = async () => {
      let feArticle = await getArticle(articleId, lang);
      setArticle(feArticle);
      document.title = `${feArticle.title} | DeWiki`;
    };

    fetchArticle();
  }, [articleId, lang]);

  if (!article) {
    return <div>Loading...</div>;
  }

  let isLatest = article.meta.latest.includes(lang);

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
        <div className="text-lg text-gray-500 underline font-semibold text-center">
          <Link to={`/${lang}/a/${articleId}/edit`}>
            <span className="mr-3">{t('edit')}</span>
          </Link>
          <Link to={`/${lang}/a/${articleId}/mr`}>
            <span>{t('history')}</span>
          </Link>
        </div>
        <div className="text-lg text-gray-500 font-semibold text-center mb-10">
          {t('state')}: {isLatest ? t('latest') : t('behind')}
          <span> [ </span>
          {article.meta.latest.map((lg: string) => (
            <>
              <Link key={lg} to={`/${lg}/a/${articleId}`} className="underline">
                {lg}
              </Link>
              <span> </span>
            </>
          ))}
          <span>]</span>
        </div>
        <Grid container justifyContent="center" alignItems="center">
          <Box width={markdownBoxWidth}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className={'markdown-body'}>
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
