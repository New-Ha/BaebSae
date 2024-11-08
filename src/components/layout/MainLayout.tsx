import Navbar from 'components/layout/Navbar';
import { Outlet } from 'react-router-dom';

import styles from './Layout.module.scss';
import SearchBar from 'components/SearchBar';
import RecommendBox from 'components/RecommendBox';
import PopularUserBox from 'components/PopularUserBox';

export default function MainLayout() {
    return (
        <div className={styles.layout}>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <aside className={styles.right}>
                <SearchBar />
                <RecommendBox />
                <PopularUserBox />
            </aside>
        </div>
    );
}
