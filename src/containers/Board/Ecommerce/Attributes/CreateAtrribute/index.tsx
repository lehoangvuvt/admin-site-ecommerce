import Main from "../../../../../components/Main";
import CreateAttribute from "./CreateAttribute";
import './style.scss';

const MainCreateAttribute = () => {
    return (
        <Main
            title1={'Attributes'}
            title2={'Create attribute'}
            children={<CreateAttribute />}
        />
    )
}

export default MainCreateAttribute;