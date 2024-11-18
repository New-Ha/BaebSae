import { useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { onSnapshot } from 'firebase/firestore';
import { friendDocumentRef } from 'constants/refs';
import UserBox from 'components/sidebar/UserBox';
import NoContentBox from 'components/posts/NoContentBox';

export default function MyFriendPage() {
    const { user } = useContext(AuthContext);
    const [friends, setFriends] = useState<string[]>([]);

    useEffect(() => {
        if (!user?.uid) return;

        onSnapshot(friendDocumentRef(user?.uid as string), snapshot => {
            const data = snapshot.data();
            if (data?.users) {
                const friendIds = data.users.map((user: { id: string }) => user.id);
                setFriends(friendIds);
            } else {
                setFriends([]);
            }
        });
    }, [user?.uid]);

    return (
        <div>
            {friends.length > 0 ? (
                friends.map(friendUid => (
                    <div key={friendUid}>
                        <UserBox userUid={friendUid} />
                    </div>
                ))
            ) : (
                <NoContentBox text="추가한 친구가 없습니다." />
            )}
        </div>
    );
}
