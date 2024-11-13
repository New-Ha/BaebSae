import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import { arrayRemove, updateDoc } from 'firebase/firestore';
import { postRef } from 'constants/refs';
import { PostType } from 'pages/home';
import { CommentType } from 'components/comments/CommentForm';
import { toast } from 'react-toastify';

import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';
import { ReactComponent as Delete } from '../../assets/circle_x.svg';
import styles from './comment.module.scss';

interface CommentBoxProps {
    comment: CommentType;
    post: PostType;
}

export default function CommentBox({ comment, post }: CommentBoxProps) {
    const { user } = useContext(AuthContext);

    const handleDeleteComment = async () => {
        if (post && user) {
            try {
                await updateDoc(postRef(post.id), {
                    comments: arrayRemove(comment),
                });
                toast.success('댓글을 삭제했습니다.');
            } catch (error) {
                toast.error('댓글 삭제 중 문제가 발생하였습니다.');
            }
        }
    };

    return (
        <div key={comment.createdAt} className={styles.comment}>
            {post.avatar ? (
                <img src={post.avatar} alt="commenter avatar" className={styles.comment__avatar} />
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
                    {comment.uid === user?.uid && (
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
