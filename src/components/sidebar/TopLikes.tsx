import { useEffect, useState } from 'react';
import { PostType } from 'pages/home';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { postListCollectionRef } from 'constants/refs';
import PostBox from 'components/posts/PostBox';
import { useNavigate } from 'react-router-dom';

import styles from './sidebar.module.scss';
import SidePostBox from 'components/sidebar/SidePostBox';
import { ROUTE_PATH } from 'constants/route';

export default function TopLikes() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        const popularQuery = query(postListCollectionRef, orderBy('likesCount', 'desc'), orderBy('createdAt', 'desc'));
        onSnapshot(popularQuery, snapshot => {
            const dataObj = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setPosts(dataObj as PostType[]);
        });
    }, [posts]);

    return (
        <div className={styles.side__popular}>
            <div className={styles.side__popular__title}>Top Likes</div>
            <div className={styles.side__popular__posts}>
                {posts.slice(0, 4).map(post => (
                    <div key={post.id} className="box__hover" onClick={() => navigate(`/posts/${post.id}`)}>
                        <SidePostBox post={post} />
                    </div>
                ))}
            </div>
            <div className={styles.side__popular__more_btn} onClick={() => navigate(ROUTE_PATH.POPULAR)}>
                Read More..
            </div>
        </div>
    );
}
