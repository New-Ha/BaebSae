import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

import { ROUTE_PATH } from 'constants/route';
import OAuthLogin from 'components/users/OAuthLogin';

interface SignupInfo {
    email: string;
    password: string;
    passwordConfirm: string;
}

export default function SignupForm() {
    const navigate = useNavigate();
    const [signupInfo, setSignupInfo] = useState<SignupInfo>({
        email: '',
        password: '',
        passwordConfirm: '',
    });
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;

        if (name === 'email') {
            setSignupInfo(prev => ({ ...prev, email: value }));
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!value?.match(emailRegex)) {
                setError('이메일 형식이 올바르지 않습니다.');
            } else {
                setError('');
            }
        }

        if (name === 'password') {
            setSignupInfo(prev => ({ ...prev, password: value }));
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

        if (name === 'passwordConfirm') {
            setSignupInfo(prev => ({ ...prev, passwordConfirm: value }));

            if (value !== signupInfo.password) {
                setError('입력하신 비밀번호와 일치하지 않습니다.');
            } else {
                setError('');
            }
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const auth = getAuth(app);
            await createUserWithEmailAndPassword(auth, signupInfo.email, signupInfo.password);
            navigate(ROUTE_PATH.HOME);
            toast.success('성공적으로 회원가입이 되었습니다.');
        } catch (error: any) {
            toast.error(error.code);
        }
    };

    return (
        <form className="sign__form" onSubmit={handleSubmit}>
            <div className="sign__form__title">회원가입</div>
            <div className="sign__form__block">
                <div className="sign__form__block-col">
                    <label htmlFor="email">이메일</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={signupInfo.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            <div className="sign__form__block">
                <div className="sign__form__block-col">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={signupInfo.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            <div className="sign__form__block">
                <div className="sign__form__block-col">
                    <label htmlFor="passwordConfirm">비밀번호 확인</label>
                    <input
                        type="password"
                        id="passwordConfirm"
                        name="passwordConfirm"
                        value={signupInfo.passwordConfirm}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            {error && error?.length > 0 && (
                <div className="sign__form__block">
                    <div className="form__error">{error}</div>
                </div>
            )}
            <div className="sign__form__block">
                계정이 있으신가요?
                <Link to={ROUTE_PATH.LOGIN} className="sign__form__link">
                    로그인하러 가기
                </Link>
            </div>
            <div className="sign__form__block">
                <button type="submit" className="sign__form__btn--submit">
                    회원가입
                </button>
            </div>
            <div className="sign__form__block">
                <OAuthLogin />
            </div>
        </form>
    );
}
