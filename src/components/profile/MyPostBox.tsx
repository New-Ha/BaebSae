import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from 'context/AuthContext';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { postListCollectionRef } from 'constants/refs';
import { PostType } from 'pages/home';
import NoPostBox from 'components/posts/NoPostBox';
import PostBox from 'components/posts/PostBox';

export default function MyPostBox() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [myPosts, setMyPosts] = useState<PostType[]>([]);

    useEffect(() => {
        if (user) {
            const myPostsQuery = query(
                postListCollectionRef(),
                where('uid', '==', user.uid),
                orderBy('createdAt', 'desc'),
            );

            onSnapshot(myPostsQuery, snapshot => {
                let postsObj = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setMyPosts(postsObj as PostType[]);
            });
        }
    }, [user]);

    return (
        <>
            {myPosts.length > 0 ? (
                myPosts.map(post => (
                    <div key={post.id} className="post__nav-detail" onClick={() => navigate(`/posts/${post.id}`)}>
                        <PostBox post={post} />
                    </div>
                ))
            ) : (
                <NoPostBox />
            )}
        </>
    );
}
