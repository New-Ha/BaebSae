import { useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import NotificationBox from 'components/notifications/NotificationBox';
import NoContentBox from 'components/posts/NoContentBox';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { notiCollectionRef } from 'constants/refs';

export interface NotificationType {
    id: string;
    uid: string;
    url: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    useEffect(() => {
        if (user) {
            const notificationsQuery = query(
                notiCollectionRef,
                where('uid', '==', user.uid),
                orderBy('createdAt', 'desc'),
            );
            onSnapshot(notificationsQuery, snapshot => {
                let dataObj = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setNotifications(dataObj as NotificationType[]);
            });
        }
    }, [user]);

    return (
        <div className="notifications">
            {notifications.length > 0 ? (
                <>
                    {notifications.map(noti => (
                        <NotificationBox key={noti.id} notification={noti} />
                    ))}
                </>
            ) : (
                <NoContentBox text="새로운 알림이 없습니다." />
            )}
        </div>
    );
}
