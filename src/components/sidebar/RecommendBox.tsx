import UserBox from './UserBox';
import { ReactComponent as Reset } from '../../assets/init_arrow.svg';

import styles from './sidebar.module.scss';

export default function RecommendBox() {
    const recommendList = [0, 1, 2, 3, 4];
    return (
        <div className={styles.side__box}>
            <div className={styles.side__box__header}>
                <span>You might like</span>
                <button type="button" className={styles.side__box__header_btn}>
                    <Reset />
                </button>
            </div>
            {/* {recommendList.map(recommendUser => (
                <div key={recommendUser}>
                    <UserBox />
                </div>
            ))} */}
        </div>
    );
}
