import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostType } from 'pages/home';
import Header from 'components/common/Header';
import NoPostBox from 'components/posts/NoPostBox';
import PostBox from 'components/posts/PostBox';

export default function PostDetailPage() {
    const params = useParams();
    const [post, setPost] = useState<PostType | null>(null);

    const getPost = useCallback(async () => {
        if (params.postId) {
            const docRef = doc(db, 'posts', params.postId);
            // const docSnap = await getDoc(docRef);

            onSnapshot(docRef, doc => {
                setPost({ ...(doc.data() as PostType), id: doc.id });
            });
        }
    }, [params.postId]);

    useEffect(() => {
        if (params.postId) {
            getPost();
        }
    }, [params.postId, getPost]);

    return (
        <>
            <Header title="" />
            <div>{post ? <PostBox post={post} /> : <NoPostBox />}</div>
        </>
    );
}
