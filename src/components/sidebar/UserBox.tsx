import { useEffect, useState } from 'react';
import { ReactComponent as UserAvatar } from '../../assets/user_circle.svg';
import { UserType } from 'context/AuthContext';
import { getDoc } from 'firebase/firestore';
import { userDocumentRef } from 'constants/refs';

import styles from './sidebar.module.scss';
import BeMyFriend from 'components/posts/BeMyFriend';

export default function UserBox({ userUid }: { userUid: string }) {
    const [user, setUser] = useState<UserType>({
        uid: userUid,
        displayName: '',
        email: '',
        photoURL: '',
    });

    useEffect(() => {
        (async () => {
            await getDoc(userDocumentRef(userUid)).then(snapshot => {
                if (snapshot.exists()) setUser(snapshot.data() as UserType);
            });
        })();
    }, [userUid]);

    return (
        <div className={styles.userBox}>
            <div className={styles.userBox__userinfo}>
                {user.photoURL ? <img src={user.photoURL} alt="user avatar" /> : <UserAvatar />}
                <div className={styles.userBox__profile}>
                    <div className={styles.userBox__profile__name}>{user.displayName} 님</div>
                    <div className={styles.userBox__profile__email}>{user.email}</div>
                </div>
            </div>
            <BeMyFriend beFriendUid={userUid} />
        </div>
    );
}
