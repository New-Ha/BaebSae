import Header from 'components/Header';
import NoPostBox from 'components/posts/NoPostBox';
import PostBox from 'components/posts/PostBox';
import PostForm from 'components/posts/PostForm';
import AuthContext from 'context/AuthContext';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { useContext, useEffect, useState } from 'react';

export interface PostType {
    id: string;
    content: string;
    createdAt: string;
    uid: string;
    email: string;
    name: string;
    avatar: string;
    hashtags?: string[];
    imageUrl?: string;
}

export default function HomePage() {
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
                console.log(dataObj);
                setPosts(dataObj as PostType[]);
            });
        }
    }, [user]);

    return (
        <main className="home">
            <Header title="Home" />
            <PostForm />
            <div className="post">
                {posts.length > 0 ? posts.map(post => <PostBox key={post.id} post={post} />) : <NoPostBox />}
            </div>
        </main>
    );
}
