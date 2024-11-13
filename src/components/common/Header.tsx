import { useNavigate } from 'react-router-dom';

import { ReactComponent as Back } from '../../assets/left_arrow.svg';
import styles from './common.module.scss';

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <div className={styles.header}>
            <button type="button" onClick={() => navigate(-1)}>
                <Back />
            </button>
            <div className={styles.header__title}>{title}</div>
        </div>
    );
}
