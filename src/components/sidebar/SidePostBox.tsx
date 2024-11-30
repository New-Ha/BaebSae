import { useEffect, useState } from 'react';
import { PostType } from 'pages/home';
import { getDoc } from 'firebase/firestore';
import { userDocumentRef } from 'constants/refs';
import { UserType } from 'context/AuthContext';

import styles from './sidebar.module.scss';
import { ReactComponent as Heart } from '../../assets/active_heart.svg';
import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';

interface SidePostBoxProps {
    post: PostType;
}

export default function SidePostBox({ post }: SidePostBoxProps) {
    const [author, setAuthor] = useState<UserType | null>(null);

    const truncate = (content: string) => {
        return content.length > 15 ? content.substring(0, 10) + '...' : content;
    };

    useEffect(() => {
        (async () => {
            await getDoc(userDocumentRef(post.uid)).then(authorSnapshot => {
                if (authorSnapshot.exists()) setAuthor(authorSnapshot.data() as UserType);
            });
        })();
    }, [post.uid]);

    return (
        <div className={styles.side__popular__post}>
            <div className={styles.side__popular__post__avatar}>
                {author?.photoURL ? <img src={author.photoURL} alt="author avatar" /> : <DefaultAvatar />}
            </div>
            <div className={styles.side__popular__post__box}>
                <div className={styles.side__popular__post__top}>
                    <div className={styles.side__popular__post__top_likes}>
                        <Heart />
                        {post.likesCount}
                    </div>
                    <div className={styles.side__popular__post__top_createdAt}>
                        {post.createdAt.split('.').slice(0, 3).join('.')}.
                    </div>
                </div>
                <div className={styles.side__popular__post__content}>{truncate(post.content)}</div>
            </div>
        </div>
    );
}
