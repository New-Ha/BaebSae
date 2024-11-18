import { toast } from 'react-toastify';

const errorMessages: Record<string, string> = {
    'auth/user-not-found': '등록된 사용자가 없습니다.',
    'auth/wrong-password': '비밀번호가 잘못되었습니다.',
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/network-request-failed': '네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.',
    default: '알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.',
};

export const errorToast = (errorCode: string) => {
    const message = errorMessages[errorCode] || errorMessages.default;
    toast.error(message);
};
