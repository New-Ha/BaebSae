import { useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'firebaseApp';
import PostBox from 'components/posts/PostBox';
import PostForm from 'components/posts/PostForm';
import NoContentBox from 'components/posts/NoContentBox';

export interface PostType {
    id: string;
    content: string;
    createdAt: string;
    hashtags?: string[];
    imageUrl?: string;
    like?: string[];
    likesCount?: number;
    uid: string;
}

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        // 로그인 여부 확인
        if (user) {
            let postsRef = collection(db, 'posts');
            const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
            onSnapshot(postsQuery, snapshot => {
                let dataObj = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setPosts(dataObj as PostType[]);
            });
        }
    }, [user]);

    return (
        <main className="home">
            <PostForm />
            <div className="">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.id} className="post__nav-detail" onClick={() => navigate(`/posts/${post.id}`)}>
                            <PostBox post={post} />
                        </div>
                    ))
                ) : (
                    <NoContentBox text="게시글이 존재하지 않습니다." />
                )}
            </div>
        </main>
    );
}
