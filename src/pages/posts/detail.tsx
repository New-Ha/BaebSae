import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { commentCollectionRef, postDocumentRef } from 'constants/refs';
import { PostType } from 'pages/home';
import PostBox from 'components/posts/PostBox';
import NoContentBox from 'components/posts/NoContentBox';
import CommentBox from 'components/comments/CommentBox';
import CommentForm, { CommentType } from 'components/comments/CommentForm';

export default function PostDetailPage() {
    const params = useParams();
    const [post, setPost] = useState<PostType | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);

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

    useEffect(() => {
        const commentsQuery = query(commentCollectionRef(params.postId as string), orderBy('createdAt', 'desc'));
        onSnapshot(commentsQuery, snapshot => {
            let commentObj = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));
            setComments(commentObj as CommentType[]);
        });
    }, [params.postId]);

    return (
        <>
            {post ? (
                <div>
                    <PostBox post={post} />
                    <CommentForm post={post} />
                    {comments.length > 0 &&
                        comments.map((comment: CommentType) => (
                            <CommentBox key={comment.id} comment={comment} postId={params.postId as string} />
                        ))}
                </div>
            ) : (
                <NoContentBox text="해당 게시글에 댓글이 존재하지 않습니다." />
            )}
        </>
    );
}
