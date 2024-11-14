import { ReactComponent as UserAvatar } from '../../assets/user_circle.svg';
import styles from './sidebar.module.scss';

export default function UserBox() {
    return (
        <div className={styles.userBox}>
            <UserAvatar />
            <div className={styles.userBox__profile}>
                <div className={styles.userBox__profile__name}>user 님</div>
                <div className={styles.userBox__profile__email}>test@test.com</div>
            </div>
        </div>
    );
}
