import { useContext } from 'react';
import AuthContext from 'context/AuthContext';

import styles from './common.module.scss';
import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from 'constants/route';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

export default function ProfileBox() {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const { user } = useContext(AuthContext);

    const handleClickLogout = () => {
        try {
            signOut(auth).then(() => {
                toast.success('로그아웃 되었습니다.');
                navigate(ROUTE_PATH.LOGIN);
            });
        } catch (error: any) {
            toast.error(`로그아웃 중 문제(${error.message})가 발생했습니다.`);
        }
    };

    return (
        <div className={styles.profile_box}>
            <div className={styles.profile_box__top}>
                <div className={styles.profile_box__user}>
                    {user?.photoURL ? (
                        <img src={user?.photoURL} alt="user avatar" className={styles.profile_box__user_avatar} />
                    ) : (
                        <DefaultAvatar />
                    )}
                    <div className={styles.profile_box__user_name}>{user?.displayName}</div>
                    <div className={styles.profile_box__user_email}>@ {user?.email.split('@')[0]}</div>
                </div>
            </div>
            <div className={styles.profile_box__btns}>
                <button
                    type="button"
                    className={styles.profile_box__left_btn}
                    onClick={() => navigate(ROUTE_PATH.PROFILE)}>
                    Profile
                </button>
                <button type="button" className={styles.profile_box__right_btn} onClick={handleClickLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
