import { useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import { CommentType } from 'components/comments/CommentForm';
import { commentsCollectionGroupRef } from 'constants/refs';
import CommentBox from 'components/comments/CommentBox';
import NoPostBox from 'components/posts/NoPostBox';
import { useNavigate } from 'react-router-dom';

export default function MyRepliesPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState<CommentType[]>([]);

    useEffect(() => {
        (async () => {
            if (user) {
                const commentsQuery = query(
                    commentsCollectionGroupRef,
                    where('uid', '==', user.uid),
                    orderBy('createdAt', 'desc'),
                );

                const commentsSnapshot = await getDocs(commentsQuery);
                const commentObj = commentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setComments(commentObj as CommentType[]);
            }
        })();
    }, [user]);

    return (
        <div>
            {comments?.length > 0 ? (
                comments.map(comment => (
                    <div key={comment.id} className="comment__box" onClick={() => navigate(`/posts/${comment.postId}`)}>
                        <CommentBox comment={comment} />
                    </div>
                ))
            ) : (
                <NoPostBox />
            )}
        </div>
    );
}
