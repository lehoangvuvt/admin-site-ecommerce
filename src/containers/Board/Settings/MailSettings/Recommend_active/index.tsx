import Main from '../../../../../components/Main';
import ActiveRecommendation from './ActiveRecommendation';
import './style.scss';
import "antd/dist/antd.css";

const MainActiveRecommendation = () => {
    return (
        <Main
            title1={'Admin'}
            title2={'Setting'}
            children={<ActiveRecommendation />}
        />
    )
}

export default MainActiveRecommendation;