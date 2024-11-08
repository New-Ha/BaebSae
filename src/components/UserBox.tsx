import { ReactComponent as UserAvatar } from '../assets/user_circle.svg';

export default function UserBox() {
    return (
        <div className="user__box">
            <UserAvatar />
            <div className="user__box__profile">
                <div className="user__box__profile-name">user 님</div>
                <div className="user__box__profile-email">test@test.com</div>
            </div>
        </div>
    );
}
