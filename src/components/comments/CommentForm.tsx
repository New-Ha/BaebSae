import { useContext, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { addDoc } from 'firebase/firestore';
import { commentCollectionRef } from 'constants/refs';
import { toast } from 'react-toastify';
import { PostType } from 'pages/home';

import styles from './comment.module.scss';

export interface CommentFormProps {
    post: PostType | null;
}

export interface CommentType {
    id: string;
    comment: string;
    uid: string;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
}

export default function CommentForm({ post }: CommentFormProps) {
    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState<string>('');

    const onChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {
            target: { value },
        } = e;
        setComment(value);
    };

    const onsubmitComment = async (e: any) => {
        e.preventDefault();

        if (post && user) {
            try {
                const commentObj = {
                    comment,
                    uid: user.uid,
                    name: user.displayName,
                    avatar: user.photoURL,
                    email: user.email,
                    createdAt: new Date().toLocaleDateString('ko', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                };

                await addDoc(commentCollectionRef(post.id), commentObj);

                setComment('');
                toast.success('댓글이 등록되었습니다.');
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <form className={styles.comment_form} onSubmit={onsubmitComment}>
            <textarea
                className={styles.comment_form__textarea}
                name="comment"
                id="comment"
                value={comment}
                placeholder="댓글을 입력해주세요."
                onChange={onChangeComment}
                required
            />
            <div className={styles.comment_form__submit_area}>
                <div />
                <input type="submit" value="확인" className={styles.comment_form__submit_btn} disabled={!comment} />
            </div>
        </form>
    );
}
