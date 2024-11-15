import { useContext, useState } from 'react';
import AuthContext from 'context/AuthContext';
import Header from 'components/common/Header';
import ProfileSetForm from 'components/profile/ProfileSetForm';
import MyPostBox from 'pages/profile/post';
import MyFriendBox from 'pages/profile/friend';
import MyActivityBox from 'pages/profile/activity/likes';

import styles from './Layout.module.scss';

const tabs = [
    { label: 'My Post', component: <MyPostBox /> },
    { label: 'My Friend', component: <MyFriendBox /> },
    { label: 'My Activity', component: <MyActivityBox /> },
];

export default function ProfileLayout() {
    const { user } = useContext(AuthContext);
    const [curTab, setCurTab] = useState<string>(tabs[0].label);

    return (
        <div className={styles.profile}>
            <Header title={`${user?.displayName || '사용자'} Profile`} />
            <ProfileSetForm />
            <div className={styles.profile__content}>
                <div className="profile__tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.label}
                            type="button"
                            onClick={() => setCurTab(tab.label)}
                            className={`${
                                curTab === tab.label ? styles.profile__tabs_tab_active : styles.profile__tabs_tab
                            }`}
                            disabled={curTab === tab.label}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                {tabs.map(tab => curTab === tab.label && <div key={tab.label}>{tab.component}</div>)}
            </div>
        </div>
    );
}
