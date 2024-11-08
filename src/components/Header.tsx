import { useNavigate } from 'react-router-dom';

import { ReactComponent as Back } from '../assets/left_arrow.svg';

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="post__header">
            <button type="button" onClick={() => navigate(-1)}>
                <Back className="post__header-btn" />
            </button>
            <div className="post__header-title">{title}</div>
        </div>
    );
}
