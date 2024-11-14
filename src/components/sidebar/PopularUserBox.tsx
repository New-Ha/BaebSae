import UserBox from './UserBox';

import { ReactComponent as Setting } from '../../assets/setting.svg';
import styles from './sidebar.module.scss';

export default function PopularUserBox() {
    const popularList = [0, 1, 2, 3, 4];
    return (
        <div className={styles.side__box}>
            <div className={styles.side__box__header}>
                <span>Popular Now</span>
                <button type="button" className={styles.side__box__header_btn}>
                    <Setting />
                </button>
            </div>
            {popularList.map(pop => (
                <div key={pop}>
                    <UserBox />
                </div>
            ))}
        </div>
    );
}
