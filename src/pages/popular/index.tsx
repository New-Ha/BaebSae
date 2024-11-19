import { useEffect, useState } from 'react';
import { PostType } from 'pages/home';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { postListCollectionRef } from 'constants/refs';
import Header from 'components/common/Header';
import PostBox from 'components/posts/PostBox';

export default function PopularPage() {
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
        <>
            <Header title="Popular" />
            {posts.map(post => (
                <PostBox key={post.id} post={post} />
            ))}
        </>
    );
}
