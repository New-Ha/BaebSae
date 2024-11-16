import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import styles from '../../../components/profile/profile.module.scss';

export default function MyActivityPage() {
    const navigate = useNavigate();
    const path = useLocation();
    const curTab = path.pathname.split('/').reverse()[0];
    const tabs = [
        { label: 'Likes', path: 'likes' },
        { label: 'Replies', path: 'replies' },
    ];

    return (
        <div className={styles.profile_activity}>
            <div className={styles.profile_activity__tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.label}
                        type="button"
                        onClick={() => navigate(`/profile/activity/${tab.path}`)}
                        className={`${
                            curTab === tab.path
                                ? styles.profile_activity__tabs_active
                                : styles.profile_activity__tabs_tab
                        }`}
                        disabled={curTab === tab.path}>
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
}
