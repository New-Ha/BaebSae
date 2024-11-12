import { useContext, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from 'firebaseApp';
import { toast } from 'react-toastify';
import { PostType } from 'pages/home';
import { ROUTE_PATH } from 'constants/route';

import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';
import { ReactComponent as Dots } from '../../assets/dots.svg';
import { ReactComponent as Edit } from '../../assets/edit_pen.svg';
import { ReactComponent as Delete } from '../../assets/delete_trash.svg';
import { ReactComponent as Comment } from '../../assets/comment.svg';
import { ReactComponent as Likes } from '../../assets/heart.svg';
import { ReactComponent as Bookmark } from '../../assets/bookmark_icon.svg';
import { ReactComponent as Share } from '../../assets/share.svg';
import { deleteObject, ref } from 'firebase/storage';

interface postBoxProps {
    post: PostType;
}

export default function PostBox({ post }: postBoxProps) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [drop, setDrop] = useState(false);

    const handleDeletePost = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const confirm = window.confirm('해당 게시글을 삭제하시겠습니까?');

        if (confirm) {
            if (post.imageUrl) {
                const imgRef = ref(storage, post.imageUrl);
                deleteObject(imgRef).catch(error => {
                    toast.error('게시글 삭제 중 문제가 발생했습니다.');
                });
            }
            await deleteDoc(doc(db, 'posts', post.id));
            toast.success('게시글을 삭제했습니다.');
            navigate(ROUTE_PATH.HOME);
        }
    };

    return (
        <div className="post">
            <div className="post__box">
                <div className="post__box__user-avatar">
                    {post?.avatar ? <img src={post.avatar} alt="user avatar" /> : <DefaultAvatar />}
                </div>
                <div className="post__box__content">
                    <div className="post__box__content__user">
                        <div className="post__box__content__user-box">
                            <span className="post__box__content__user-name">{post.name}</span>
                            <span className="post__box__content__user-email">@{post.email.split('@')[0]}</span>
                            <span className="post__box__content__createdAt">{post.createdAt}</span>
                        </div>
                        {user?.uid === post.uid && (
                            <button
                                type="button"
                                className="post__box__content__more-btn"
                                onClick={e => {
                                    e.stopPropagation();
                                    setDrop(!drop);
                                }}>
                                <Dots />
                            </button>
                        )}
                        {drop && (
                            <div className="post__box__dropdown" onClick={e => e.stopPropagation()}>
                                <button type="button" onClick={() => navigate(`/posts/edit/${post.id}`)}>
                                    <Edit />
                                    수정
                                </button>
                                <button type="button" onClick={handleDeletePost}>
                                    <Delete />
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                    {post.imageUrl && <img src={post.imageUrl} alt="" className="post__box__content__img" />}
                    <div className="post__box__content__text">{post.content}</div>
                    <div className="post-form__hashtags__outputs">
                        {post.hashtags &&
                            post.hashtags.length > 0 &&
                            post.hashtags.map((tag, idx) => (
                                <span className="post-form__hashtags-tag" key={idx}>
                                    #{tag}
                                </span>
                            ))}
                    </div>
                </div>
            </div>
            <div className="post__box__footer">
                <div className="post__box__footer-btn">
                    <button type="button">
                        <Comment />
                        <span>0</span>
                    </button>
                </div>
                <div className="post__box__footer-btn">
                    <button type="button">
                        <Likes />
                        <span>0</span>
                    </button>
                </div>
                <div className="post__box__footer-btn">
                    <button type="button">
                        <Bookmark />
                    </button>
                </div>
                <div className="post__box__footer-btn">
                    <button type="button">
                        <Share />
                    </button>
                </div>
            </div>
        </div>
    );
}
