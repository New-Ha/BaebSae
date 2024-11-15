import { useContext, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';
import { ROUTE_PATH } from 'constants/route';

import { ReactComponent as BapsaeLogo } from '../../assets/bapsae_icon.svg';
import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';
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
import { ReactComponent as Dots } from '../../assets/dots.svg';
import styles from './common.module.scss';

export default function Navbar() {
    const navigate = useNavigate();
    const path = useLocation();
    const { user } = useContext(AuthContext);
    const [active, setActive] = useState<string>(path.pathname);

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
        <header className={styles.nav}>
            <div className={styles.nav__topSection}>
                <div className={styles.nav__logo} onClick={() => navigate(ROUTE_PATH.HOME)}>
                    <BapsaeLogo />
                </div>
                <nav className={styles.nav__flex}>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.HOME)}
                        className={active === ROUTE_PATH.HOME ? styles.nav__flex__btnActive : styles.nav__flex__btn}>
                        {active === ROUTE_PATH.HOME ? <ActiveHome /> : <Home />}
                        <span className="nav__grid--text">Home</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.SEARCH)}
                        className={active === ROUTE_PATH.SEARCH ? styles.nav__flex__btnActive : styles.nav__flex__btn}>
                        {active === ROUTE_PATH.SEARCH ? <ActiveHash /> : <Hash />}
                        <span className="nav__grid--text">Search</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.NOTI)}
                        className={active === ROUTE_PATH.NOTI ? styles.nav__flex__btnActive : styles.nav__flex__btn}>
                        {active === ROUTE_PATH.NOTI ? <ActiveBell /> : <Bell />}
                        <span className="nav__grid--text">Notifications</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.POPULAR)}
                        className={active === ROUTE_PATH.POPULAR ? styles.nav__flex__btnActive : styles.nav__flex__btn}>
                        {active === ROUTE_PATH.POPULAR ? <ActivePopular /> : <Popular />}
                        <span className="nav__grid--text">Popular</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.BOOKMARKS)}
                        className={
                            active === ROUTE_PATH.BOOKMARKS ? styles.nav__flex__btnActive : styles.nav__flex__btn
                        }>
                        {active === ROUTE_PATH.BOOKMARKS ? <ActiveBookmark /> : <Bookmark />}
                        <span className="nav__grid--text">Bookmarks</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClickNav(ROUTE_PATH.PROFILE)}
                        className={active === ROUTE_PATH.PROFILE ? styles.nav__flex__btnActive : styles.nav__flex__btn}>
                        {active === ROUTE_PATH.PROFILE ? <ActiveUserCircle /> : <UserCircle />}
                        <span className="nav__grid--text">Profile</span>
                    </button>
                </nav>
            </div>
            <button type="button" onClick={handleClickLogout}>
                logout
            </button>
            <button type="button" className={styles.nav__footer}>
                <div className={styles.nav__footer__flex}>
                    <div className={styles.nav__footer__userInfo}>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="user avatar" className={styles.nav__footer__profile__img} />
                        ) : (
                            <DefaultAvatar />
                        )}
                        <div className={styles.nav__footer__profile}>
                            <div className={styles.nav__footer__profile__name}>{user?.displayName || '사용자'} 님</div>
                            <div className={styles.nav__footer__profile__email}>@{user?.email?.split('@')[0]}</div>
                        </div>
                    </div>
                    <Dots />
                </div>
            </button>
        </header>
    );
}
