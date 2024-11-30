import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';
import OAuthLogin from 'components/users/OAuthLogin';
import { ROUTE_PATH } from 'constants/route';

import styles from './sign.module.scss';
import { ReactComponent as Logo } from '../../assets/bapsae_icon.svg';

interface LoginInfo {
    email: string;
    password: string;
}

export default function LoginForm() {
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState<LoginInfo>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;

        if (name === 'email') {
            setLoginInfo(prev => ({ ...prev, email: value }));
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!value?.match(emailRegex)) {
                setError('이메일 형식이 올바르지 않습니다.');
            } else {
                setError('');
            }
        }
        if (name === 'password') {
            setLoginInfo(prev => ({ ...prev, password: value }));
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

            if (value?.length < 8) {
                setError('비밀번호는 8자리 이상 입력해주세요');
            } else if (!value?.match(passwordRegex)) {
                setError('비밀번호는 특수문자와 대문자, 소문자, 숫자를 모두 포함해야합니다.');
            } else {
                setError('');
            }
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const auth = getAuth(app);
            await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password);
            navigate(ROUTE_PATH.HOME);
            toast.success('성공적으로 로그인이 되었습니다.');
        } catch (error: any) {
            toast.error(error.code);
        }
    };

    return (
        <form className={styles.sign__form} onSubmit={handleSubmit}>
            <div className={styles.sign__form__logo}>
                <Logo />
            </div>
            <div className={styles.sign__form__title}>로그인</div>
            <div className={styles.sign__form__block}>
                <div className={styles.sign__form__block_col}>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={loginInfo.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            <div className={styles.sign__form__block}>
                <div className={styles.sign__form__block_col}>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={loginInfo.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            {error && error?.length > 0 && (
                <div className={styles.sign__form__block}>
                    <div className={styles.sign__form__error}>{error}</div>
                </div>
            )}
            <div className={styles.sign__form__block_link}>
                계정이 없으신가요?
                <Link to={ROUTE_PATH.SIGNUP} className={styles.sign__form__link}>
                    회원가입하러 가기
                </Link>
            </div>
            <div className={styles.sign__form__block}>
                <button type="submit" className={styles.sign__form__btn_submit} disabled={!!error}>
                    로그인
                </button>
            </div>
            <div className={styles.sign__form__block}>
                <OAuthLogin />
            </div>
        </form>
    );
}
