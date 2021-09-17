import Main from "../../../../../components/Main";
import CreateAttributeSet from "./CreateAttributeSet";
import './style.scss';

const MainCreateAttributeSet = () => {
    return (
        <Main
            title1={'Attribute sets'}
            title2={'Create attribute set'}
            children={<CreateAttributeSet />}
        />
    )
}

export default MainCreateAttributeSet;