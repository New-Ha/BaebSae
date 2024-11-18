import NoPostBox from 'components/posts/NoPostBox';
import UserBox from 'components/sidebar/UserBox';
import { friendDocumentRef } from 'constants/refs';
import AuthContext from 'context/AuthContext';
import { getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';

export default function MyFriendPage() {
    const { user } = useContext(AuthContext);
    const [friends, setFriends] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            const friendSnap = await getDoc(friendDocumentRef(user?.uid as string));
            if (friendSnap.exists()) {
                setFriends((friendSnap.data() as string[]) || []);
            }
        })();
    }, [user?.uid]);

    return <>{friends.length > 0 ? <UserBox /> : <NoPostBox />}</>;
}
