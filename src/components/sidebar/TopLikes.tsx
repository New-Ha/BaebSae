import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { postListCollectionRef } from 'constants/refs';
import { PostType } from 'pages/home';
import { ROUTE_PATH } from 'constants/route';
import SideLikePostBox from 'components/sidebar/SidePostBox';

import styles from './sidebar.module.scss';
import { ReactComponent as Heart } from '../../assets/heart.svg';

export default function TopLikes() {
    const navigate = useNavigate();
    const [topLikePosts, setTopLikePosts] = useState<PostType[]>([]);

    useEffect(() => {
        const likesQuery = query(
            postListCollectionRef,
            orderBy('likesCount', 'desc'),
            orderBy('createdAt', 'desc'),
            limit(4),
        );
        onSnapshot(likesQuery, snapshot => {
            const dataObj = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTopLikePosts(dataObj as PostType[]);
        });
    }, [topLikePosts]);

    return (
        <div className={styles.side__box}>
            <div className={styles.side__title}>Top Likes</div>
            <div className={styles.side__posts}>
                {topLikePosts.map((post, index) => (
                    <div key={post.id} className="box__hover" onClick={() => navigate(`/posts/${post.id}`)}>
                        <SideLikePostBox index={index} post={post}>
                            <div className={styles.side__post__count_like}>
                                <Heart />
                                <div className={styles.side__post__count_text}>{post.likesCount}</div>
                            </div>
                        </SideLikePostBox>
                    </div>
                ))}
            </div>
            <div className={styles.side__more_btn} onClick={() => navigate(ROUTE_PATH.POPULAR)}>
                Read More..
            </div>
        </div>
    );
}
