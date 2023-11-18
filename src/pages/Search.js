import React from 'react';
import Authorization from '../components/Authorization';
import Search from '../components/Search';
import ScrollToTop from '../components/utils/ScrollToTop'

const index = () => {
    return (
        <div className='bg-rosa'>
            <ScrollToTop />
            <Authorization />
            <Search />
        </div>
    )
}

export default index;