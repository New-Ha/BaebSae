import { Outlet } from 'react-router-dom';

import { ReactComponent as Bapsae } from '../../assets/bapsae.svg';
import styles from './Layout.module.scss';

export default function SignLayout() {
    return (
        <div className={styles.sign}>
            <div className={styles.sign__grid}>
                <div className={styles.sign__left}>
                    <Bapsae />
                </div>
                <div className={styles.sign__content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
