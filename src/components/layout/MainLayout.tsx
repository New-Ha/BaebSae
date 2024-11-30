import { Outlet } from 'react-router-dom';

import styles from './Layout.module.scss';
import ProfileBox from 'components/common/ProfileBox';
import Header from 'components/common/Header';
import PopularPost from 'components/sidebar/PopularPost';

export default function MainLayout() {
    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.main}>
                <aside className={styles.main__left}>
                    <ProfileBox />
                    <PopularPost />
                </aside>
                <main className={styles.main__content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
