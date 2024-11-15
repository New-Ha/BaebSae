import { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { arrayRemove, arrayUnion, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { friendDocumentRef, partnerDocumentRef } from 'constants/refs';
import { PostType } from 'pages/home';
import { toast } from 'react-toastify';

import { ReactComponent as BeFriend } from '../../assets/beFriend.svg';
import { ReactComponent as MyFriend } from '../../assets/myFriend.svg';

interface FollowingProps {
    post: PostType;
}

export interface UserType {
    id: string;
}

export default function BeMyFriend({ post }: FollowingProps) {
    const { user } = useContext(AuthContext);
    const [postPartners, setPostPartners] = useState<string[]>([]);

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

                await setDoc(partnerDocumentRef(post.uid), {
                    users: arrayUnion({ id: user.uid }, { merge: true }),
                });
            }
            toast.success('친구로 추가하였습니다.');
        } catch (error) {
            console.log(error);
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

                await updateDoc(partnerDocumentRef(post.uid), {
                    users: arrayRemove({ id: user.uid }),
                });
            }
            toast.success('친구목록에서 삭제되었습니다.');
        } catch (error) {
            console.log(error);
        }
    };

    const getFriends = useCallback(async () => {
        if (post.uid) {
            onSnapshot(partnerDocumentRef(post.uid), doc => {
                setPostPartners([]);
                doc.data()?.users.map((user: UserType) => setPostPartners((prev: string[]) => [...prev, user.id]));
            });
        }
    }, [post.uid]);

    useEffect(() => {
        if (post.uid) getFriends();
    }, [post.uid, getFriends]);

    return (
        <>
            {user?.uid !== post.uid &&
                (postPartners.includes(user?.uid as string) ? (
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
