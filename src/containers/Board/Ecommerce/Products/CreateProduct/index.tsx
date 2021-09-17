import { FC } from "react";
import { connect } from "react-redux";
import Main from "../../../../../components/Main";
import { RootReducerType } from "../../../../reducer";
import CreateProductOption from "./CreateProductOption";
import CreateProductInformation from "./CreateProductInformation";
import './style.scss';

const mapStateToProps = (state: RootReducerType) => {
    return {
        createProductStep: state.createProduct.step
    }
}

const MainCreateProduct: FC<ReturnType<typeof mapStateToProps>> = ({ createProductStep }) => {
    return (
        createProductStep === 1 ?
            <Main
                title1={'Create new product'}
                title2={'Step 1. Create product information'}
                children={<CreateProductInformation />}
            />
            :
            createProductStep === 2 ?
                <Main
                    title1={'Create new product'}
                    title2={'Step 2. Add product option'}
                    children={<CreateProductOption />}
                />
                : null
    )
}

export default connect(mapStateToProps)(MainCreateProduct);