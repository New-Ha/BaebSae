import { useNavigate } from 'react-router-dom';
import { NotificationType } from 'pages/notifications';
import { notiDocumentRef } from 'constants/refs';
import { updateDoc } from 'firebase/firestore';

import styles from './notification.module.scss';

interface NotificationProps {
    notification: NotificationType;
}

export default function NotificationBox({ notification }: NotificationProps) {
    const navigate = useNavigate();

    const handleClickNoti = async () => {
        await updateDoc(notiDocumentRef(notification.id), {
            isRead: true,
        });

        navigate(notification.url);
    };

    return (
        <>
            <div className={styles.notification_box}>
                <div onClick={handleClickNoti}>
                    <div className={styles.notification_box__flex}>
                        <div className={styles.notification_box__createdAt}>{notification.createdAt}</div>
                        {notification.isRead === false && <div className={styles.notification_box__unread} />}
                    </div>
                    <div className={styles.notification_box__content}>{notification.content}</div>
                </div>
            </div>
        </>
    );
}
