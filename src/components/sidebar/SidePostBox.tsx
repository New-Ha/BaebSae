import { useEffect, useState } from 'react';
import { PostType } from 'pages/home';
import { getDoc } from 'firebase/firestore';
import { userDocumentRef } from 'constants/refs';
import { UserType } from 'context/AuthContext';

import styles from './sidebar.module.scss';
import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';

interface SidePostBoxProps {
    index: number;
    post: PostType;
    children: React.ReactNode;
}

export default function SidePostBox({ index, post, children }: SidePostBoxProps) {
    const [author, setAuthor] = useState<UserType | null>(null);

    const truncate = (content: string) => {
        return content.length > 13 ? content.substring(0, 13) + '...' : content;
    };

    useEffect(() => {
        (async () => {
            await getDoc(userDocumentRef(post.uid)).then(authorSnapshot => {
                if (authorSnapshot.exists()) setAuthor(authorSnapshot.data() as UserType);
            });
        })();
    }, [post.uid]);

    return (
        <div className={styles.side__post}>
            <div className={styles.side__post__rank}>{index + 1}</div>
            <div className={styles.side__post__top}>
                <div className={styles.side__post__author}>
                    <div className={styles.side__post__author_avatar}>
                        {author?.photoURL ? <img src={author.photoURL} alt="author avatar" /> : <DefaultAvatar />}
                    </div>
                    <div className={styles.side__post__author_name}>{author?.displayName}</div>
                </div>
                <div className={styles.side__post__count}>{children}</div>
                <div className={styles.side__post__createdAt}>{post.createdAt.split('.').slice(0, 3).join('.')}.</div>
            </div>
            <div className={styles.side__post__content}>{truncate(post.content)}</div>
        </div>
    );
}
