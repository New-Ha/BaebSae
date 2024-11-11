import { useContext, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { PostType } from 'pages/home';

import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';
import { ReactComponent as Dots } from '../../assets/dots.svg';
import { ReactComponent as Edit } from '../../assets/edit_pen.svg';
import { ReactComponent as Delete } from '../../assets/delete_trash.svg';

interface postBoxProps {
    post: PostType;
}

export default function PostBox({ post }: postBoxProps) {
    const { user } = useContext(AuthContext);
    const [drop, setDrop] = useState(false);

    return (
        <div className="post__box">
            <div className="post__box__user-avatar">
                {post?.avatar ? <img src={post.avatar} alt="user avatar" /> : <DefaultAvatar />}
            </div>
            <div className="post__box__content">
                <div className="post__box__content__user">
                    <div className="post__box__content__user-box">
                        <span className="post__box__content__user-name">{post.name}</span>
                        <span className="post__box__content__user-email">{post.email}</span>
                    </div>
                    {user?.uid === post.uid && (
                        <button type="button" className="post__box__content__more-btn" onClick={() => setDrop(!drop)}>
                            <Dots />
                        </button>
                    )}
                    {drop && (
                        <div className="post__box__dropdown">
                            <button type="button">
                                <Edit />
                                수정
                            </button>
                            <button type="button">
                                <Delete />
                                삭제
                            </button>
                        </div>
                    )}
                </div>
                <div className="post__box__content__text">{post.content}</div>
            </div>
        </div>
    );
}
