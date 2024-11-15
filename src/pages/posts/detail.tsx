import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';
import { PostType } from 'pages/home';
import Header from 'components/common/Header';
import NoPostBox from 'components/posts/NoPostBox';
import PostBox from 'components/posts/PostBox';
import { postDocumentRef } from 'constants/refs';
import CommentForm, { CommentType } from 'components/comments/CommentForm';
import CommentBox from 'components/comments/CommentBox';

export default function PostDetailPage() {
    const params = useParams();
    const [post, setPost] = useState<PostType | null>(null);

    const getPost = useCallback(async () => {
        if (params.postId) {
            // const docSnap = await getDoc(postDocumentRef(params.id as string));

            onSnapshot(postDocumentRef(params.postId as string), doc => {
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
            {post ? (
                <div>
                    <PostBox post={post} />
                    <CommentForm post={post} />
                    {post.comments &&
                        post.comments
                            .slice(0)
                            .reverse()
                            .map((comment: CommentType, index: number) => (
                                <CommentBox key={index} comment={comment} post={post} />
                            ))}
                </div>
            ) : (
                <NoPostBox />
            )}
        </>
    );
}
