import { useNavigate } from 'react-router-dom';
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from 'firebaseApp';
import { ROUTE_PATH } from 'constants/route';
import { toast } from 'react-toastify';

import styles from './sign.module.scss';

export default function OAuthLogin() {
    const navigate = useNavigate();

    const onClickOAuthLogin = async (e: any) => {
        const {
            target: { name },
        } = e;

        let provider;
        const auth = getAuth(app);

        if (name === 'google') {
            provider = new GoogleAuthProvider();
        }
        if (name === 'github') {
            provider = new GithubAuthProvider();
        }

        await signInWithPopup(auth, provider as GoogleAuthProvider | GithubAuthProvider)
            .then(result => {
                toast.success('로그인 되었습니다.');
                navigate(ROUTE_PATH.HOME);
            })
            .catch(error => {
                toast.error(error.message);
            });
    };
    return (
        <div className={styles.sign__form__oauth}>
            <div className={styles.sign__form__block}>
                <button
                    type="button"
                    name="google"
                    className={styles.sign__form__oauth_google}
                    onClick={onClickOAuthLogin}>
                    Google로 로그인하기
                </button>
            </div>
            <div className={styles.sign__form__block}>
                <button
                    type="button"
                    name="github"
                    className={styles.sign__form__oauth_github}
                    onClick={onClickOAuthLogin}>
                    Github으로 로그인하기
                </button>
            </div>
        </div>
    );
}
