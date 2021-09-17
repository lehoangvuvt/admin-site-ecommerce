import Main from "../../../../../components/Main";
import CreateCategory from "./CreateCategory";
import './style.scss';

const MainCreateCategory = () => {
    return (
        <Main
            title1={'Product'}
            title2={'Create category'}
            children={<CreateCategory />}
        />
    )
}

export default MainCreateCategory;