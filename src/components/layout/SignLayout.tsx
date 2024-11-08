import { ReactNode } from 'react';
import { ReactComponent as Bapsae } from '../../assets/bapsae.svg';
import styles from './Layout.module.scss';

interface SignLayoutProps {
    children: ReactNode;
}

export default function SignLayout({ children }: SignLayoutProps) {
    return (
        <div className={styles.sign}>
            <div className={styles.layout}>
                <div className={styles.sign__grid}>
                    <div className={styles.sign__bapsae}>
                        <Bapsae />
                    </div>
                    <div className={styles.sign__content}>{children}</div>
                </div>
            </div>
        </div>
    );
}
