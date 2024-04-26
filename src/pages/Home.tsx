import { useEffect, useState } from 'react';
import { dryrun } from '@permaweb/aoconnect';
import Document from '../components/Document';
// import Header from './Header';

const MEME = '-a4T7XLMDGTcu8_preKXdUT6__4sJkMhYLEJZkXUYd0';
const INITIAL_FRAME = 'J_6eJSA-NZ8BnmdZVtb3vTTd1_LDVBi4_c4grV7mWGc';

function Home() {
    let mdContent: string = `
# 这是一个标题

这是一些**粗体**文本。
## 标题二
正文
  `;
    return (
        <div>
            <div>
                <p className="text-blue-600">Hello, World!</p>
                <Document articleId={1} lang="en" />
            </div>
            {/* <Header /> */}
        </div>
    );
}

export default Home;
