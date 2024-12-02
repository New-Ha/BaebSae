import { useEffect, useState } from 'react';
import { PostType } from 'pages/home';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { postListCollectionRef } from 'constants/refs';
import PostBox from 'components/posts/PostBox';
import { useNavigate } from 'react-router-dom';

export default function LikeRankPage() {
    const navigate = useNavigate();
    const [likePosts, setLikePosts] = useState<PostType[]>([]);

    useEffect(() => {
        const likesQuery = query(postListCollectionRef, orderBy('likesCount', 'desc'), orderBy('createdAt', 'desc'));
        onSnapshot(likesQuery, snapshot => {
            const dataObj = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLikePosts(dataObj as PostType[]);
        });
    }, [likePosts]);

    return (
        <div className="home__post_list">
            {likePosts.map(post => (
                <div className="box__hover" onClick={() => navigate(`/posts/${post.id}`)}>
                    <PostBox key={post.id} post={post} />
                </div>
            ))}
        </div>
    );
}
