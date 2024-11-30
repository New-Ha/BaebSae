import { useNavigate } from 'react-router-dom';
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from 'firebaseApp';
import { ROUTE_PATH } from 'constants/route';
import { toast } from 'react-toastify';

import styles from './sign.module.scss';
import { userDocumentRef } from 'constants/refs';
import { getDoc, setDoc } from 'firebase/firestore';
import { errorToast } from 'constants/errorToast';
import { useState } from 'react';

export default function OAuthLogin() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleOAuthLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsSubmitting(true);

        const { name } = e.currentTarget;
        const auth = getAuth(app);

        const providerMap: Record<string, GoogleAuthProvider | GithubAuthProvider> = {
            google: new GoogleAuthProvider(),
            github: new GithubAuthProvider(),
        };
        const provider = providerMap[name];

        try {
            const result = await signInWithPopup(auth, provider as GoogleAuthProvider | GithubAuthProvider);
            const user = result.user;

            await setDoc(userDocumentRef(user.uid), {
                email: user.email,
                displayName: user.displayName || '사용자',
                photoURL: user.photoURL || '',
                createdAt: new Date().toISOString(),
            });
            toast.success('로그인 되었습니다.');
            navigate(ROUTE_PATH.HOME);
        } catch (error: any) {
            errorToast(error.code);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.sign__form__oauth}>
            <div className={styles.sign__form__block}>
                <button
                    type="button"
                    name="google"
                    className={styles.sign__form__oauth_google}
                    onClick={handleOAuthLogin}
                    disabled={isSubmitting}>
                    Google로 로그인하기
                </button>
            </div>
            <div className={styles.sign__form__block}>
                <button
                    type="button"
                    name="github"
                    className={styles.sign__form__oauth_github}
                    onClick={handleOAuthLogin}
                    disabled={isSubmitting}>
                    Github으로 로그인하기
                </button>
            </div>
        </div>
    );
}
