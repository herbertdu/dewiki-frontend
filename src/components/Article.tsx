import { getArticle } from '../utils/article';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import MarkNav from 'markdown-navbar';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css';
import './navbar.css';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        main: {
            flexGrow: 1,
            // padding: theme.spacing(4),
            // paddingBottom: theme.spacing(3),
            // paddingTop: theme.spacing(12),
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
    console.log(articleId);
    console.log(lang);

    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
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
            <Drawer className={classes.drawer} variant={'permanent'} classes={{ paper: classes.paper }}>
                <Box>
                    <MarkNav
                        className="article"
                        source={content}
                        headingTopOffset={40} //离顶部的距离
                        ordered={false} //是否显示标题题号1,2等
                    />
                </Box>
            </Drawer>
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

export default Article;
