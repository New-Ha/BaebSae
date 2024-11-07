import { getAuth, signOut } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

export default function HomePage() {
    const onClickLogout = async () => {
        const auth = getAuth(app);
        await signOut(auth);
        toast.success('로그아웃 되었습니다.');
    };

    return (
        <div>
            <button onClick={onClickLogout}>logout</button>
        </div>
    );
}
