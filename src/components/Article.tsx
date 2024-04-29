import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import MarkdownNavbar from '../utils/markdown-navbar/index';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import NotFound from '../pages/NotFound';

import { getArticle } from '../utils/article';

import { Affix } from 'antd';
import 'github-markdown-css';
import "../utils/markdown-navbar/navbar.css";

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
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        const fetchArticle = async () => {
            let article = await getArticle(articleId, lang);
            setContent(article.content);
            setTitle(article.name);
            document.title = `${article.name} | DeWiki`;
            setIsLoading(false);
        };

        fetchArticle();
    }, [articleId, lang]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
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
                    className={classes.drawer}
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
                            source={content}
                            headingTopOffset={40} //The distance from the top
                            ordered={false} //Does it display the title numbers 1, 2, etc.
                            updateHashAuto = {false} // Automatically update the hash value of browser address when page scrolling if true
                            updateHashOnClick = {false}
                        />
                    </Box>
                </Drawer>
            </Affix>
            <main className={classes.main}>
                <h1 className="text-center font-bold text-5xl mb-10 capitalize">{title}</h1>
                <Grid container justifyContent="center" alignItems="center">
                    <Box width={'70%'}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            className={'markdown-body'}
                        >
                            {content}
                        </ReactMarkdown>
                    </Box>
                </Grid>
            </main>
        </div>
    );
};

export function ArticleWithParams() {
    let { id } = useParams();
    if (!id) {
        return <NotFound />;
    }
    if (!/^\d+$/.test(id)) {
        return <NotFound />;
    }
    let articleId = parseInt(id);
    if (isNaN(articleId)) {
        return <NotFound />;
    }
    return <Article articleId={articleId} lang="en" />;
}

export default Article;
