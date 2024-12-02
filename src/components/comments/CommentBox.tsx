import { useContext, useEffect, useState } from 'react';
import AuthContext, { UserType } from 'context/AuthContext';
import { deleteDoc, getDoc, increment, updateDoc } from 'firebase/firestore';
import { commentDocumentRef, postDocumentRef, userDocumentRef } from 'constants/refs';
import { CommentType } from 'components/comments/CommentForm';
import { toast } from 'react-toastify';

import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';
import { ReactComponent as Delete } from '../../assets/circle_x.svg';
import styles from './comment.module.scss';

interface CommentBoxProps {
    comment: CommentType;
    postId?: string;
}

export default function CommentBox({ comment, postId }: CommentBoxProps) {
    const { user } = useContext(AuthContext);
    const [author, setAuthor] = useState<UserType | null>(null);

    const handleDeleteComment = async () => {
        if (postId && user && comment) {
            try {
                await deleteDoc(commentDocumentRef({ postId, commentId: comment.id }));
                await updateDoc(postDocumentRef(postId), {
                    commentsCount: increment(-1),
                });
                toast.success('댓글을 삭제했습니다.');
            } catch (error) {
                toast.error('댓글 삭제 중 문제가 발생하였습니다.');
            }
        }
    };

    // author 가져오기
    useEffect(() => {
        (async () => {
            await getDoc(userDocumentRef(comment.uid)).then(authorSnapshot => {
                if (authorSnapshot.exists()) setAuthor(authorSnapshot.data() as UserType);
            });
        })();
    }, [comment.uid]);

    return (
        <div key={comment.createdAt} className={styles.comment}>
            {author?.photoURL ? (
                <img src={author?.photoURL} alt="commenter avatar" className={styles.comment__avatar} />
            ) : (
                <DefaultAvatar />
            )}
            <div className={styles.comment__content}>
                <div className={styles.comment__top}>
                    <div className={styles.comment__top__userInfo}>
                        <div className={styles.comment__top__userInfo_name}>{author?.displayName}</div>
                        <div className={styles.comment__top__userInfo_email}>@{author?.email.split('@')[0]}</div>
                        <div className={styles.comment__top__userInfo_createdAt}>{comment.createdAt}</div>
                    </div>
                    {postId && comment.uid === user?.uid && (
                        <button type="button" className={styles.comment__deleteBtn} onClick={handleDeleteComment}>
                            <Delete />
                        </button>
                    )}
                </div>
                <div className={styles.comment__text}>{comment.comment}</div>
            </div>
        </div>
    );
}
