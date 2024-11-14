import { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject } from 'firebase/storage';
import { db } from 'firebaseApp';
import { toast } from 'react-toastify';
import { PostType } from 'pages/home';
import { ROUTE_PATH } from 'constants/route';
import { bookmarksRef, imageRef, postRef } from 'constants/refs';
import BeMyFriend from 'components/posts/BeMyFriend';

import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';
import { ReactComponent as Dots } from '../../assets/dots.svg';
import { ReactComponent as Edit } from '../../assets/edit_pen.svg';
import { ReactComponent as Delete } from '../../assets/delete_trash.svg';
import { ReactComponent as Comment } from '../../assets/comment.svg';
import { ReactComponent as ActiveComment } from '../../assets/comment_active.svg';
import { ReactComponent as Likes } from '../../assets/heart.svg';
import { ReactComponent as FillLikes } from '../../assets/active_heart.svg';
import { ReactComponent as Bookmark } from '../../assets/bookmark_icon.svg';
import { ReactComponent as ActiveBookmark } from '../../assets/bookmark_icon_active.svg';
import { ReactComponent as Share } from '../../assets/share.svg';

interface postBoxProps {
    post: PostType;
}

// bookmarks : id:string ,bookmarks: PostType[];

export default function PostBox({ post }: postBoxProps) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [drop, setDrop] = useState(false);
    const [bookmarks, setBookmarks] = useState<string[]>([]);

    const handleDeletePost = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const confirm = window.confirm('해당 게시글을 삭제하시겠습니까?');

        if (confirm) {
            // 이미지가 있는 게시글이라면, 삭제시 storage 내의 이미지도 삭제
            if (post.imageUrl) {
                deleteObject(imageRef(post.imageUrl)).catch(error => {
                    toast.error('게시글 삭제 중 문제가 발생했습니다.');
                    console.log(error);
                });
            }
            await deleteDoc(doc(db, 'posts', post.id));
            toast.success('게시글을 삭제했습니다.');
            navigate(ROUTE_PATH.HOME);
        }
    };

    const handleLikes = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // 이벤트 버블링을 막지 않으면, home에서 좋아요 클릭시 detail page로 이동
        e.stopPropagation();
        if (user?.uid && post.like?.includes(user?.uid)) {
            // 사용자가 좋아요한 게시글이라면 좋아요를 취소하는 arrayRemove() 사용
            await updateDoc(postRef(post.id), {
                like: arrayRemove(user.uid),
                likesCount: post.likesCount ? post.likesCount - 1 : 0,
            });
        } else {
            // 사용자가 좋아요한 게시글이 아니면 좋아요에 추가하는 arrayUnion() 사용
            await updateDoc(postRef(post.id), {
                like: arrayUnion(user?.uid),
                likesCount: post.likesCount ? post.likesCount + 1 : 1,
            });
        }
    };

    const hasUserCommented = () => {
        if (user && post.comments) {
            return post.comments?.some(comment => comment.uid === user?.uid);
        }
        return;
    };

    const handleBookmark = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        try {
            if (user?.uid) {
                const bookmarkDocSnap = await getDoc(bookmarksRef(user.uid));

                if (bookmarkDocSnap.exists()) {
                    const userData = bookmarkDocSnap.data();

                    if (userData.posts) {
                        if (userData.posts.includes(post.id)) {
                            await updateDoc(bookmarksRef(user.uid), {
                                posts: arrayRemove(post.id),
                            });
                            toast.success('북마크에서 삭제되었습니다.');
                        } else {
                            await updateDoc(bookmarksRef(user.uid), {
                                posts: arrayUnion(post.id),
                            });
                            toast.success('북마크에 추가되었습니다.');
                        }
                    }
                } else {
                    await setDoc(bookmarksRef(user.uid), {
                        posts: [post.id],
                    });
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('북마크 처리 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = onSnapshot(bookmarksRef(user.uid), doc => {
            const posts = doc.data()?.posts;
            if (posts.length > 0) {
                setBookmarks(posts);
            } else {
                setBookmarks([]);
            }
        });

        return () => unsubscribe();
    }, [user?.uid]);

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
                        {user?.uid === post.uid ? (
                            <button
                                type="button"
                                className="post__box__content__more-btn"
                                onClick={e => {
                                    e.stopPropagation();
                                    setDrop(!drop);
                                }}>
                                <Dots />
                            </button>
                        ) : (
                            <BeMyFriend post={post} />
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
                        {hasUserCommented() ? <ActiveComment /> : <Comment />}
                        <span>{post.comments?.length || 0}</span>
                    </button>
                </div>
                <div className="post__box__footer-btn">
                    <button type="button" onClick={handleLikes}>
                        {user && post.like?.includes(user.uid) ? <FillLikes /> : <Likes />}
                        <span>{post.likesCount || 0}</span>
                    </button>
                </div>
                <div className="post__box__footer-btn">
                    <button type="button" onClick={handleBookmark}>
                        {bookmarks.some((id: string) => id === post.id) ? <ActiveBookmark /> : <Bookmark />}
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
