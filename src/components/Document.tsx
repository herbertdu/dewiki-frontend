import { getArticle } from '../utils/article';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import MarkNav from 'markdown-navbar';
import remarkGfm from 'remark-gfm'; // 划线、表、任务列表和直接url等的语法扩展
import rehypeRaw from 'rehype-raw'; // 解析标签，支持html语法
import 'github-markdown-css'; //代码块的背景和表格线条等样式
import './navbar.css'; //引入修改后的目录格式

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

const Document = ({ articleId, lang }: { articleId: number; lang: string }) => {
    const classes = useStyles();
    console.log(articleId);
    console.log(lang);

    const [content, setContent] = React.useState('');
    useEffect(() => {
        const fetchArticle = async () => {
            let article = await getArticle(articleId, lang);
            setContent(article.content);
            document.title = article.name;
        };

        fetchArticle();
    }, [articleId, lang]);

    return (
        <div>
            
            <Drawer className={classes.drawer} variant={'permanent'} classes={{ paper: classes.paper }}>
                <Box>
                    <MarkNav
                        className="article"
                        source={content}
                        headingTopOffset={1} //离顶部的距离
                        ordered={false} //是否显示标题题号1,2等
                    />
                </Box>
            </Drawer>
            <main className={classes.main}>
                <h1 className="text-center font-bold text-5xl mb-10 capitalize">{document.title}</h1>
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

export default Document;
