import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import { deleteDoc } from 'firebase/firestore';
import { commentDocumentRef } from 'constants/refs';
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

    const handleDeleteComment = async () => {
        if (postId && user && comment) {
            try {
                await deleteDoc(commentDocumentRef({ postId, commentId: comment.id }));
                toast.success('댓글을 삭제했습니다.');
            } catch (error) {
                toast.error('댓글 삭제 중 문제가 발생하였습니다.');
            }
        }
    };

    return (
        <div key={comment.createdAt} className={styles.comment}>
            {comment.avatar ? (
                <img src={comment.avatar} alt="commenter avatar" className={styles.comment__avatar} />
            ) : (
                <DefaultAvatar />
            )}
            <div className={styles.comment__content}>
                <div className={styles.comment__top}>
                    <div className={styles.comment__top__userInfo}>
                        <div className={styles.comment__top__userInfo_name}>{comment.name}</div>
                        <div className={styles.comment__top__userInfo_email}>@{comment.email.split('@')[0]}</div>
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
