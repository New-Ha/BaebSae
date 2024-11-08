import Navbar from 'components/layout/Navbar';
import { Outlet } from 'react-router-dom';

import styles from './Layout.module.scss';
import SearchBar from 'components/sidebar/SearchBar';
import RecommendBox from 'components/sidebar/RecommendBox';
import PopularUserBox from 'components/sidebar/PopularUserBox';

export default function MainLayout() {
    return (
        <div className={styles.layout}>
            <Navbar />
            <main className={styles.main}>
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
