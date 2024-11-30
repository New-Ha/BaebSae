import { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { friendDocumentRef, postListCollectionRef } from 'constants/refs';
import { PostType } from 'pages/home';
import PostBox from 'components/posts/PostBox';
import NoContentBox from 'components/posts/NoContentBox';
import { useNavigate } from 'react-router-dom';

export default function FriendsPostPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [friendIds, setFriendIds] = useState<string[]>([]);
    const [friendPosts, setFriendPosts] = useState<PostType[]>([]);

    useEffect(() => {
        if (!user?.uid) return;

        onSnapshot(friendDocumentRef(user?.uid as string), snapshot => {
            const friendIds = snapshot.data()?.users.map((user: { id: string }) => user.id || []);
            setFriendIds(friendIds);
        });
    }, [user?.uid]);

    useEffect(() => {
        if (friendIds?.length !== 0) {
            (async () => {
                const postsQuery = query(
                    postListCollectionRef,
                    where('uid', 'in', friendIds),
                    orderBy('createdAt', 'desc'),
                );

                onSnapshot(postsQuery, snapshot => {
                    let dataObj = snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));

                    setFriendPosts(dataObj as PostType[]);
                });
            })();
        }
    }, [friendIds]);

    return (
        <div className="home__post_list">
            {friendPosts.length !== 0 ? (
                friendPosts.map(post => (
                    <div key={post.id} className="box__hover" onClick={() => navigate(`/posts/${post.id}`)}>
                        <PostBox post={post} />
                    </div>
                ))
            ) : friendIds?.length !== 0 ? (
                <NoContentBox text="친구들이 작성한 게시글이 없습니다." />
            ) : (
                <NoContentBox text="등록한 친구가 없습니다." />
            )}
        </div>
    );
}
