import { useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { onSnapshot } from 'firebase/firestore';
import { bookmarksDocumentRef, postDocumentRef } from 'constants/refs';
import { PostType } from 'pages/home';
import Header from 'components/common/Header';
import PostBox from 'components/posts/PostBox';
import NoContentBox from 'components/posts/NoContentBox';

export default function BookmarksPage() {
    const { user } = useContext(AuthContext);
    const [postIds, setPostIds] = useState<string[]>([]);
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        if (user) {
            onSnapshot(bookmarksDocumentRef(user?.uid), snapshot => {
                setPostIds(snapshot.data()?.posts || []);
            });
        }
    }, [user]);

    useEffect(() => {
        if (postIds.length === 0) return;

        postIds.forEach(id => {
            onSnapshot(postDocumentRef(id), doc => {
                if (doc.exists()) {
                    setPosts(prev => {
                        const updatedPosts = prev.filter(post => post.id !== doc.id);
                        return [...updatedPosts, { id: doc.id, ...doc.data() } as PostType];
                    });
                }
            });
        });
    }, [postIds]);

    return (
        <>
            <Header title="Bookmarks" />
            {posts.length !== 0 ? (
                posts.map(post => <PostBox key={post.id} post={post} />)
            ) : (
                <NoContentBox text="북마크한 게시글이 없습니다." />
            )}
        </>
    );
}
