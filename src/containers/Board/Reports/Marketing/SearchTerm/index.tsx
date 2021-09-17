import Main from '../../../../../components/Main';
import SearchTerm from './SearchTerm';
import './style.scss';

const MainSearchTerm = () => {
    return (
        <Main
            title1={'Marketing report'}
            title2={'Search Terms'}
            children={<SearchTerm />}
        />
    )
}

export default MainSearchTerm;