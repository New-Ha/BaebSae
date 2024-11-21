import { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { addDoc, arrayRemove, arrayUnion, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { friendDocumentRef, notiCollectionRef } from 'constants/refs';
import { toast } from 'react-toastify';

import { ReactComponent as BeFriend } from '../../assets/beFriend.svg';
import { ReactComponent as MyFriend } from '../../assets/myFriend.svg';

export default function BeMyFriend({ beFriendUid }: { beFriendUid: string }) {
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
                        users: arrayUnion({ id: beFriendUid }),
                    },
                    { merge: true },
                );

                // 친구에 추가된 사람에게 알려주는 notification
                await addDoc(notiCollectionRef, {
                    uid: beFriendUid,
                    url: '#',
                    content: `"${user.displayName}"의 친구로 추가됐습니다.💚`,
                    isRead: false,
                    createdAt: new Date()?.toLocaleDateString('ko', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                });
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
                    users: arrayRemove({ id: beFriendUid }),
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
        if (user?.uid && beFriendUid) getFriends();
    }, [user?.uid, beFriendUid, getFriends]);

    return (
        <>
            {user?.uid !== beFriendUid &&
                (friendList.includes(beFriendUid as string) ? (
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
