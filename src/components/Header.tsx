import { useNavigate } from 'react-router-dom';

import { ReactComponent as Back } from '../assets/left_arrow.svg';

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="header">
            <button type="button" onClick={() => navigate(-1)}>
                <Back />
            </button>
            <div className="header-title">{title}</div>
        </div>
    );
}
