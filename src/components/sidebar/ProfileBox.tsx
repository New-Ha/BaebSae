import { useContext } from 'react';
import AuthContext from 'context/AuthContext';

import styles from './common.module.scss';

export default function ProfileBox() {
    const { user } = useContext(AuthContext);

    return (
        <div className={styles.profile_box}>
            <div className={styles.profile_box__top}>
                <div className={styles.profile_box__user}>
                    <img src={user?.photoURL} alt="user avatar" className={styles.profile_box__user_avatar}></img>
                    <div className={styles.profile_box__user_name}>{user?.displayName}</div>
                    <div className={styles.profile_box__user_email}>@ {user?.email.split('@')[0]}</div>
                </div>
            </div>
            <div className={styles.profile_box__btns}>
                <button type="button" className={styles.profile_box__left_btn}>
                    Profile
                </button>
                <button type="button" className={styles.profile_box__right_btn}>
                    Logout
                </button>
            </div>
        </div>
    );
}
