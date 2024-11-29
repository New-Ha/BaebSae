import { useEffect, useState } from 'react';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { postListCollectionRef, userCollectionRef } from 'constants/refs';
import { UserType } from 'context/AuthContext';
import { PostType } from 'pages/home';
import NoContentBox from 'components/posts/NoContentBox';
import PostBox from 'components/posts/PostBox';
import UserBox from 'components/sidebar/UserBox';

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [posts, setPosts] = useState<PostType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const tabs = ['Posts', 'Users'];
    const [curTab, setCurTab] = useState<'Posts' | 'Users'>('Posts');

    useEffect(() => {
        if (!searchQuery.trim()) {
            setPosts([]);
            setUsers([]);
            return;
        }

        const hashtagQuery = query(
            postListCollectionRef,
            where('hashtags', 'array-contains-any', [searchQuery]),
            orderBy('createdAt', 'desc'),
        );

        const contentQuery = query(
            postListCollectionRef,
            where('content', '>=', searchQuery),
            where('content', '<=', searchQuery + '\uf8ff'),
            orderBy('content'),
            orderBy('createdAt', 'desc'),
        );

        onSnapshot(hashtagQuery, snapshot => {
            const hashtagResults = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setPosts(prev => {
                const combinedResults = [...prev, ...(hashtagResults as PostType[])];
                return combinedResults.filter(
                    (result, index, self) => self.findIndex(r => r.id === result.id) === index,
                );
            });
        });

        onSnapshot(contentQuery, snapshot => {
            const contentResults = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setPosts(prev => {
                const combinedResults = [...prev, ...(contentResults as PostType[])];
                return combinedResults.filter(
                    (result, index, self) => self.findIndex(r => r.id === result.id) === index,
                );
            });
        });
    }, [searchQuery]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setPosts([]);
            setUsers([]);
            return;
        }

        const userQuery = query(
            userCollectionRef,
            where('displayName', '>=', searchQuery),
            where('displayName', '<=', searchQuery + '\uf8ff'),
        );

        onSnapshot(userQuery, snapshot => {
            const userResults = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data(),
            }));
            setUsers(userResults as UserType[]);
        });
    }, [searchQuery]);

    return (
        <div className="search">
            <div className="search__input">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="검색어를 입력하세요."
                />
            </div>
            <div className="search__tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        type="button"
                        className={curTab === tab ? 'search__tabs-tab_active' : 'search__tabs-tab'}
                        onClick={() => setCurTab(tab as 'Posts' | 'Users')}>
                        {tab}{' '}
                        <span className="search__tabs-tab__span">
                            {tab === 'Posts' ? posts.length || 0 : users.length || 0}
                        </span>
                    </button>
                ))}
            </div>
            <div className="search__content">
                {curTab === 'Posts' &&
                    (posts.length > 0 ? (
                        posts.map(post => <PostBox key={post.id} post={post} />)
                    ) : (
                        <NoContentBox text="검색 결과가 없습니다." />
                    ))}
                {curTab === 'Users' &&
                    (users.length > 0 ? (
                        users.map(user => <UserBox key={user.uid} userUid={user.uid} />)
                    ) : (
                        <NoContentBox text="검색 결과가 없습니다." />
                    ))}
            </div>
        </div>
    );
}
