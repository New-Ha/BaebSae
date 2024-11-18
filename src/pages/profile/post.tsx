import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from 'context/AuthContext';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { postListCollectionRef } from 'constants/refs';
import { PostType } from 'pages/home';
import PostBox from 'components/posts/PostBox';
import NoContentBox from 'components/posts/NoContentBox';

export default function MyPostPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [myPosts, setMyPosts] = useState<PostType[]>([]);

    useEffect(() => {
        if (user?.uid) {
            const myPostsQuery = query(
                postListCollectionRef,
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
    }, [user?.uid]);

    return (
        <>
            {myPosts.length > 0 ? (
                myPosts.map(post => (
                    <div key={post.id} className="post__nav-detail" onClick={() => navigate(`/posts/${post.id}`)}>
                        <PostBox post={post} />
                    </div>
                ))
            ) : (
                <NoContentBox text="등록한 게시글이 없습니다." />
            )}
        </>
    );
}
