import { useContext, useState } from 'react';
import { PostType } from 'pages/home';
import { arrayUnion, updateDoc } from 'firebase/firestore';
import AuthContext from 'context/AuthContext';
import { toast } from 'react-toastify';
import { postRef } from 'constants/refs';

import styles from './comment.module.scss';

export interface CommentFormProps {
    post: PostType | null;
}

export interface CommentType {
    comment: string;
    uid: string;
    name: string;
    email: string;
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
                    email: user.email,
                    createdAt: new Date().toLocaleDateString('ko', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                };

                await updateDoc(postRef(post.id), {
                    // arrayUnion : 새 요소(객체)를 배열에 추가해 줌
                    comments: arrayUnion(commentObj),
                });

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
