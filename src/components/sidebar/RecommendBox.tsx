import UserBox from 'components/UserBox';
import { ReactComponent as Reset } from '../../assets/init_arrow.svg';

export default function RecommendBox() {
    const recommendList = [0, 1, 2, 3, 4];
    return (
        <div className="side__box">
            <div className="side__box__header">
                <span>You might like</span>
                <button type="button" className="side__box__header-btn">
                    <Reset />
                </button>
            </div>
            {recommendList.map(recommendUser => (
                <div key={recommendUser}>
                    <UserBox />
                </div>
            ))}
        </div>
    );
}
