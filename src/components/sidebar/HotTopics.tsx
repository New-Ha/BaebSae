import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postListCollectionRef } from 'constants/refs';
import { limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import SidePostBox from 'components/sidebar/SidePostBox';
import { PostType } from 'pages/home';

import styles from './sidebar.module.scss';
import { ReactComponent as Comment } from '../../assets/comment.svg';

export default function HotTopics() {
    const navigate = useNavigate();
    const [hotTopicPosts, setHotTopicPosts] = useState<PostType[]>([]);

    useEffect(() => {
        const hotQuery = query(postListCollectionRef, orderBy('commentsCount', 'desc'), limit(4));

        onSnapshot(hotQuery, snapshot => {
            const dataObj = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setHotTopicPosts(dataObj as PostType[]);
        });
    }, [hotTopicPosts]);

    return (
        <div className={styles.side__box}>
            <div className={styles.side__title}>Hot Topics</div>
            <div className={styles.side__posts}>
                {hotTopicPosts.map((post, index) => (
                    <div key={post.id} className="box__hover" onClick={() => navigate(`/posts/${post.id}`)}>
                        <SidePostBox index={index} post={post}>
                            <div className={styles.side__post__count_comment}>
                                <Comment />
                                <div className={styles.side__post__count_text}>{post.commentsCount}</div>
                            </div>
                        </SidePostBox>
                    </div>
                ))}
            </div>
        </div>
    );
}
