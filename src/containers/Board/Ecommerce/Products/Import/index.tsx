import Main from '../../../../../components/Main';
import Import from './Import';
import './style.scss';

const MainImport = () => {
    return (
        <Main
            title1={'Products'}
            title2={'Import products'}
            children={<Import />}
        />
    )
}

export default MainImport;