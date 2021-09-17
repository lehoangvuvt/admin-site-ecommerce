import Main from '../../../../components/Main';
import Categories from './Categories';
import '../../../../table.scss';
import './style.scss';

const MainCategories = () => {
    return (
        <Main
            title1={'Products'}
            title2={'Categories management'}
            children={<Categories />}
        />
    )
}

export default MainCategories;