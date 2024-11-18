import { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { arrayRemove, arrayUnion, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { friendDocumentRef } from 'constants/refs';
import { PostType } from 'pages/home';
import { toast } from 'react-toastify';

import { ReactComponent as BeFriend } from '../../assets/beFriend.svg';
import { ReactComponent as MyFriend } from '../../assets/myFriend.svg';

interface FollowingProps {
    post: PostType;
}

export default function BeMyFriend({ post }: FollowingProps) {
    const { user } = useContext(AuthContext);
    const [friendList, setFriendList] = useState<string[]>([]);

    const handleAddFriend = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (user?.uid) {
                await setDoc(
                    friendDocumentRef(user.uid),
                    {
                        users: arrayUnion({ id: post.uid }),
                    },
                    { merge: true },
                );
            }
            toast.success('친구로 추가하였습니다.');
        } catch (error: any) {
            toast.error('친구 추가 중 오류가 발생했습니다.', error.code);
        }
    };

    const handleDeleteFriend = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (user?.uid) {
                await updateDoc(friendDocumentRef(user.uid), {
                    users: arrayRemove({ id: post.uid }),
                });
            }
            toast.success('친구목록에서 삭제되었습니다.');
        } catch (error: any) {
            toast.error('친구목록에서 삭제 중 오류가 발생했습니다.', error.code);
        }
    };

    const getFriends = useCallback(async () => {
        if (user?.uid) {
            onSnapshot(friendDocumentRef(user.uid), snapshot => {
                snapshot.data()?.users.map((friend: { id: string }) => setFriendList(prev => [...prev, friend.id]));
            });
        }
    }, [user?.uid]);

    useEffect(() => {
        if (user?.uid && post.uid) getFriends();
    }, [user?.uid, post.uid, getFriends]);

    return (
        <>
            {user?.uid !== post.uid &&
                (friendList.includes(post.uid as string) ? (
                    <button type="button" className="post__remove_friend" onClick={handleDeleteFriend}>
                        <MyFriend />
                        <span>내 친구</span>
                    </button>
                ) : (
                    <button type="button" className="post__add_friend" onClick={handleAddFriend}>
                        <BeFriend />
                        <span>친구하자</span>
                    </button>
                ))}
        </>
    );
}
