import { useEffect, useState } from 'react';
import { ReactComponent as UserAvatar } from '../../assets/user_circle.svg';
import styles from './sidebar.module.scss';

export interface UserInfo {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
}

export default function UserBox() {
    const [user, setUser] = useState<UserInfo>({
        uid: '',
        displayName: '',
        email: '',
        photoURL: '',
    });

    return (
        <div className={styles.userBox}>
            {user.photoURL ? <img src={user.photoURL} alt="user avatar" /> : <UserAvatar />}
            <div className={styles.userBox__profile}>
                <div className={styles.userBox__profile__name}>{user.displayName} 님</div>
                <div className={styles.userBox__profile__email}>{user.email}</div>
            </div>
        </div>
    );
}
