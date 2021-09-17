import Main from "../../../../../components/Main";
import CreateBrand from "./CreateBrand";
import './style.scss';

const MainCreateBrand = () => {
    return (
        <Main
            title1={'Brands'}
            title2={'Create brand'}
            children={<CreateBrand />}
        />
    )
}

export default MainCreateBrand;