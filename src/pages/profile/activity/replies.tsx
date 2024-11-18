import CommentBox from 'components/comments/CommentBox';
import { CommentType } from 'components/comments/CommentForm';
import NoPostBox from 'components/posts/NoPostBox';
import PostBox from 'components/posts/PostBox';
import { commentsCollectionGroupRef } from 'constants/refs';
import AuthContext from 'context/AuthContext';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function MyRepliesPage() {
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
                comments.map(comment => <CommentBox key={comment.id} comment={comment} />)
            ) : (
                <NoPostBox />
            )}
        </div>
    );
}
