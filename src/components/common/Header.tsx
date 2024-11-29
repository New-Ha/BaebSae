import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'context/AuthContext';
import { useContext, useState } from 'react';
import { ROUTE_PATH } from 'constants/route';

import styles from './common.module.scss';
import { ReactComponent as BapsaeLogo } from '../../assets/bapsae.svg';
import { ReactComponent as Home } from '../../assets/home.svg';
import { ReactComponent as ActiveHome } from '../../assets/home_active.svg';
import { ReactComponent as Bell } from '../../assets/bell.svg';
import { ReactComponent as ActiveBell } from '../../assets/bell_active.svg';
import { ReactComponent as Bookmark } from '../../assets/bookmark.svg';
import { ReactComponent as ActiveBookmark } from '../../assets/bookmark_active.svg';
import { ReactComponent as Friend } from '../../assets/user.svg';
import { ReactComponent as ActiveFriend } from '../../assets/user_active.svg';
import { ReactComponent as Down } from '../../assets/down_arrow.svg';

export default function Header() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { pathname } = useLocation();
    const [activeTab, setActiveTab] = useState<string>(ROUTE_PATH.HOME);

    const handleClickNav = (path: string) => {
        setActiveTab(path);
        navigate(path);
    };

    const isActive = (path: string) => {
        if (path === ROUTE_PATH.HOME) {
            return pathname === '/' || (pathname.startsWith('/posts') && activeTab === ROUTE_PATH.HOME);
        }
        if (path === ROUTE_PATH.FRIENDS) {
            return pathname.startsWith('/friends') && activeTab === ROUTE_PATH.FRIENDS;
        }
        return pathname === path;
    };

    const renderNavButton = (
        path: string,
        ActiveIcon: React.ReactNode,
        DefaultIcon: React.ReactNode,
        label: string,
    ) => (
        <button
            type="button"
            onClick={() => handleClickNav(path)}
            className={isActive(path) ? styles.header__nav_active : styles.header__nav_btn}>
            {isActive(path) ? ActiveIcon : DefaultIcon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className={styles.header}>
            <div className={styles.header__content}>
                <div className={styles.header__left}>
                    <div className={styles.nav__logo} onClick={() => navigate(ROUTE_PATH.HOME)}>
                        <BapsaeLogo />
                    </div>
                    <input type="text" placeholder="검색어를 입력하세요." />
                </div>
                <div className={styles.header__nav}>
                    <nav className={styles.header__nav_btns}>
                        {renderNavButton(ROUTE_PATH.HOME, <ActiveHome />, <Home />, 'Home')}
                        {renderNavButton(ROUTE_PATH.FRIENDS, <ActiveFriend />, <Friend />, 'Friends')}
                        {renderNavButton(ROUTE_PATH.BOOKMARKS, <ActiveBookmark />, <Bookmark />, 'Bookmarks')}
                        {renderNavButton(ROUTE_PATH.NOTI, <ActiveBell />, <Bell />, 'Notifications')}
                    </nav>
                    <div className={styles.header__user} onClick={() => navigate(ROUTE_PATH.PROFILE)}>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="user avatar" className={styles.header__user_avatar} />
                        ) : (
                            <BapsaeLogo />
                        )}
                        <div>{user?.displayName ? user.displayName : '뱁새친구'} 님</div>
                        <button>
                            <Down />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
