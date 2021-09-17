import Main from '../../../../../components/Main';
import BestsellersReport from './BestsellersReport';
import './style.scss';

const MainBestsellersReport = () => {
    return (
        <Main
            title1={'Product report'}
            title2={'Best Sellers'}
            children={<BestsellersReport />}
        />
    )
}

export default MainBestsellersReport;