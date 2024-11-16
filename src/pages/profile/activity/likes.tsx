import { useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { postListCollectionRef } from 'constants/refs';
import { PostType } from 'pages/home';
import NoPostBox from 'components/posts/NoPostBox';
import PostBox from 'components/posts/PostBox';

export default function MyLikesPage() {
    const { user } = useContext(AuthContext);
    const [likePosts, setLikePosts] = useState<PostType[]>([]);

    useEffect(() => {
        if (user) {
            const likePostsQuery = query(
                postListCollectionRef,
                where('like', 'array-contains', user.uid),
                orderBy('createdAt', 'desc'),
            );

            onSnapshot(likePostsQuery, snapshot => {
                let postObj = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setLikePosts(postObj as PostType[]);
            });
        }
    }, [user]);

    return (
        <div>
            {likePosts?.length > 0 ? likePosts.map(post => <PostBox key={post.id} post={post} />) : <NoPostBox />}
        </div>
    );
}
