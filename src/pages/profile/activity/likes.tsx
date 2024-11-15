import { useContext, useEffect, useState } from 'react';

import styles from '../../../components/profile/profile.module.scss';
import AuthContext from 'context/AuthContext';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { postListCollectionRef } from 'constants/refs';
import { PostType } from 'pages/home';
import NoPostBox from 'components/posts/NoPostBox';
import PostBox from 'components/posts/PostBox';

export default function MyLikesPage() {
    const { user } = useContext(AuthContext);
    const tabs = ['Likes', 'Replies'];
    const [activeTab, setActiveTab] = useState<string>(tabs[0]);
    const [likePosts, setLikePosts] = useState<PostType[]>([]);
    const [replies, setReplies] = useState([]);

    // useEffect(() => {
    //     if (user) {
    //         const likePostsQuery = query(
    //             postListCollectionRef(),
    //             where('likes', 'array-contains', user.uid),
    //             orderBy('createdAt', 'desc'),
    //         );

    //         onSnapshot(likePostsQuery, snapshot => {
    //             let postObj = snapshot.docs.map(doc => ({
    //                 ...doc.data(),
    //                 id: doc.id,
    //             }));
    //             setLikePosts(postObj as PostType[]);
    //         });
    //     }
    // }, [user]);

    return (
        <div className={styles.profile_activity}>
            <div className={styles.profile_activity__tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`${
                            activeTab === tab ? styles.profile_activity__tabs_active : styles.profile_activity__tabs_tab
                        }`}
                        disabled={activeTab === tab}>
                        {tab}
                    </button>
                ))}
            </div>
            {activeTab === tabs[0] && (
                <div>
                    {likePosts?.length > 0 ? (
                        likePosts.map(post => <PostBox key={post.id} post={post} />)
                    ) : (
                        <NoPostBox />
                    )}
                </div>
            )}
            {activeTab === tabs[1] && <div>replies posts</div>}
        </div>
    );
}
