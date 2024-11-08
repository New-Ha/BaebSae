import UserBox from 'components/UserBox';
import { ReactComponent as Setting } from '../assets/setting.svg';

export default function PopularUserBox() {
    const popularList = [0, 1, 2, 3, 4];
    return (
        <div className="side__box">
            <div className="side__box__header">
                <span>Popular Now</span>
                <button type="button" className="side__box__header-btn">
                    <Setting />
                </button>
            </div>
            {popularList.map(pop => (
                <div key={pop}>
                    <UserBox />
                </div>
            ))}
        </div>
    );
}
