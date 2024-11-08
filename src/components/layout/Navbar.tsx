import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

import { ReactComponent as Bapsae } from '../../assets/bapsae.svg';
import { ReactComponent as Home } from '../../assets/home.svg';
import { ReactComponent as ActiveHome } from '../../assets/home_active.svg';
import { ReactComponent as Hash } from '../../assets/hash.svg';
import { ReactComponent as ActiveHash } from '../../assets/hash_active.svg';
import { ReactComponent as Bell } from '../../assets/bell.svg';
import { ReactComponent as ActiveBell } from '../../assets/bell_active.svg';
import { ReactComponent as Bookmark } from '../../assets/bookmark.svg';
import { ReactComponent as ActiveBookmark } from '../../assets/bookmark_active.svg';
import { ReactComponent as Popular } from '../../assets/popular.svg';
import { ReactComponent as ActivePopular } from '../../assets/popular_active.svg';
import { ReactComponent as UserCircle } from '../../assets/user_circle.svg';
import { ReactComponent as ActiveUserCircle } from '../../assets/user_circle_active.svg';
import { ReactComponent as More } from '../../assets/dots.svg';
import { ROUTE_PATH } from 'constants/route';
import styles from './Layout.module.scss';

export default function Navbar() {
    const navigate = useNavigate();
    const [active, setActive] = useState<string>(ROUTE_PATH.HOME);

    const handleClickNav = (path: string) => {
        setActive(path);
        navigate(path);
    };

    const handleClickLogout = async () => {
        const auth = getAuth(app);
        await signOut(auth);
        toast.success('로그아웃 되었습니다.');
    };

    return (
        <header className={styles.header}>
            <div className={styles.header__topSection}>
                <div className={styles.header__logo}>
                    <Bapsae />
                </div>
                <nav className={styles.header__flex}>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.HOME)}
                        className={
                            active === ROUTE_PATH.HOME ? styles.header__flex__btnActive : styles.header__flex__btn
                        }>
                        {active === ROUTE_PATH.HOME ? <ActiveHome /> : <Home />}
                        <span className="nav__grid--text">Home</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.SEARCH)}
                        className={
                            active === ROUTE_PATH.SEARCH ? styles.header__flex__btnActive : styles.header__flex__btn
                        }>
                        {active === ROUTE_PATH.SEARCH ? <ActiveHash /> : <Hash />}
                        <span className="nav__grid--text">Explore</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.NOTI)}
                        className={
                            active === ROUTE_PATH.NOTI ? styles.header__flex__btnActive : styles.header__flex__btn
                        }>
                        {active === ROUTE_PATH.NOTI ? <ActiveBell /> : <Bell />}
                        <span className="nav__grid--text">Notifications</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.POPULAR)}
                        className={
                            active === ROUTE_PATH.POPULAR ? styles.header__flex__btnActive : styles.header__flex__btn
                        }>
                        {active === ROUTE_PATH.POPULAR ? <ActivePopular /> : <Popular />}
                        <span className="nav__grid--text">Popular</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.BOOKMARKS)}
                        className={
                            active === ROUTE_PATH.BOOKMARKS ? styles.header__flex__btnActive : styles.header__flex__btn
                        }>
                        {active === ROUTE_PATH.BOOKMARKS ? <ActiveBookmark /> : <Bookmark />}
                        <span className="nav__grid--text">Bookmarks</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.PROFILE)}
                        className={
                            active === ROUTE_PATH.PROFILE ? styles.header__flex__btnActive : styles.header__flex__btn
                        }>
                        {active === ROUTE_PATH.PROFILE ? <ActiveUserCircle /> : <UserCircle />}
                        <span className="nav__grid--text">Profile</span>
                    </button>
                </nav>
            </div>
            <button type="button" className={styles.header__footer}>
                <div className={styles.header__footer__userInfo}>
                    {' '}
                    <UserCircle />
                    {/* <img src="../../assets/user_circle.svg" alt="user avatar" /> */}
                    <div className={styles.header__footer__profile}>
                        <div className={styles.header__footer__profile__name}>user님</div>
                        <div className={styles.header__footer__profile__email}>test@test.com</div>
                    </div>
                </div>
                <More />
            </button>
        </header>
    );
}
