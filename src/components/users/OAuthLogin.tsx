import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

export default function OAuthLogin() {
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
            })
            .catch(error => {
                toast.error(error.message);
            });
    };
    return (
        <>
            <div className="sign__form__block">
                <button type="button" name="google" className="sign__form__btn--google" onClick={onClickOAuthLogin}>
                    Google로 로그인하기
                </button>
            </div>
            <div className="form__block">
                <button type="button" name="github" className="sign__form__btn--github" onClick={onClickOAuthLogin}>
                    Github으로 로그인하기
                </button>
            </div>
        </>
    );
}
