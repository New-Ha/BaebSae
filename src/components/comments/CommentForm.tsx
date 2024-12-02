import { useContext, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { addDoc, increment, updateDoc } from 'firebase/firestore';
import { commentCollectionRef, notiCollectionRef, postDocumentRef } from 'constants/refs';
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
    createdAt: string;
    postId: string;
}

export default function CommentForm({ post }: CommentFormProps) {
    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState<string>('');

    const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {
            target: { value },
        } = e;
        setComment(value);
    };

    const truncate = (content: string) => {
        return content.length > 10 ? content.substring(0, 10) + '...' : content;
    };

    const handleSubmitComment = async (e: any) => {
        e.preventDefault();

        if (post && user) {
            try {
                const commentObj = {
                    comment,
                    uid: user.uid,
                    createdAt: new Date().toLocaleDateString('ko', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                    postId: post.id,
                };

                await addDoc(commentCollectionRef(post.id), commentObj);
                await updateDoc(postDocumentRef(post.id), {
                    commentsCount: increment(1),
                });

                // 본인이 작성한 댓글이 아니라면 알림을 생성
                if (user.uid !== post.uid) {
                    await addDoc(notiCollectionRef, {
                        uid: post.uid,
                        url: `/posts/${post.id}`,
                        content: `"${truncate(post.content)}" 글에 댓글이 작성되었습니다.👀`,
                        isRead: false,
                        createdAt: new Date()?.toLocaleDateString('ko', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }),
                    });
                }

                toast.success('댓글이 등록되었습니다.');
                setComment('');
            } catch (error: any) {
                toast.error('댓글을 등록하는데 실패했습니다.');
                console.log(error);
            }
        }
    };

    return (
        <form className={styles.comment_form} onSubmit={handleSubmitComment}>
            <textarea
                className={styles.comment_form__textarea}
                name="comment"
                id="comment"
                value={comment}
                placeholder="댓글을 입력해주세요."
                onChange={handleChangeComment}
                required
            />
            <div className={styles.comment_form__submit_area}>
                <div />
                <input type="submit" value="확인" className={styles.comment_form__submit_btn} disabled={!comment} />
            </div>
        </form>
    );
}
