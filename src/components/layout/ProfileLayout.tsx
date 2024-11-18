import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from 'constants/route';
import Header from 'components/common/Header';
import ProfileSetForm from 'components/profile/ProfileSetForm';

import styles from './Layout.module.scss';

const tabs = [
    { label: 'My Post', sort: 'post', path: `${ROUTE_PATH.PROFILE}/${ROUTE_PATH.PROFILE_MY_POST}` },
    { label: 'My Friend', sort: 'friend', path: `${ROUTE_PATH.PROFILE}/${ROUTE_PATH.PROFILE_MY_FRIEND}` },
    {
        label: 'My Activity',
        sort: 'activity',
        path: `${ROUTE_PATH.PROFILE}/${ROUTE_PATH.PROFILE_ACTIVITY}/${ROUTE_PATH.PROFILE_ACTIVITY_LIKES}`,
    },
];

export default function ProfileLayout() {
    const navigate = useNavigate();
    const path = useLocation();
    const { user } = useContext(AuthContext);

    return (
        <div className={styles.profile}>
            <Header title={`${user?.displayName || '사용자'} Profile`} />
            <ProfileSetForm />
            <div className={styles.profile__content}>
                <div className={styles.profile__tabs}>
                    {tabs.map(tab => (
                        <button
                            key={tab.label}
                            type="button"
                            onClick={() => navigate(tab.path)}
                            className={`${
                                path.pathname.includes(tab.sort)
                                    ? styles.profile__tabs_tab_active
                                    : styles.profile__tabs_tab
                            }`}
                            disabled={path.pathname.includes(tab.sort)}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
