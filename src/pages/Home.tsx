import { useEffect, useState } from 'react';
import { dryrun } from '@permaweb/aoconnect';
// import Header from './Header';
import NotFound from './NotFound';
import React from 'react';

function Home() {
    console.log(`Home ${window.location.pathname}`)
    // if(window.location.pathname !== '/') {
    //     return <NotFound />
    // }

    return (
        <div>
            <div>
                <p className="text-blue-600">Hello, World!</p>
            </div>
            {/* <Header /> */}
        </div>
    );
}

export default Home;
