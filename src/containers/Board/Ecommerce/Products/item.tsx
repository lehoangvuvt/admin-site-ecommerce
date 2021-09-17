import { FC } from "react";
import { connect } from 'react-redux';
import Rating from "@material-ui/lab/Rating";
import { formatter } from '../../../../utils/currency.formatter';
import { ItemPropsType } from "../../../types";
import { useRouter } from "../../../../hooks/router";

const Item: FC<ItemPropsType> = ({ productInformation }) => {
    const router = useRouter();
    const IMG_URL = productInformation.products[0] && productInformation.products[0].images.length > 0 ? productInformation.products[0].images[0].PRISM_URL : null;
    const IMAGE_NAME = productInformation.products[0] && productInformation.products[0].images.length > 0 ? productInformation.products[0].images[0].IMAGE_NAME : null;

    const viewDetails = () => {
        router.push(`products/detail/${productInformation.PRODUCT_NAME}?psid=${productInformation.SID}`);
    }

    return (
        <div
            onClick={() => { viewDetails() }}
            className='products-container__right__products-container__item'>
            <div className='products-container__right__products-container__item__top'>
                {IMG_URL ? <img src={IMG_URL} /> : null}
                {IMAGE_NAME ? <img src={`http://localhost:5035/products/image/${IMAGE_NAME}`} /> : null}
            </div>
            <div className='products-container__right__products-container__item__bottom'>
                <div className='products-container__right__products-container__item__bottom__top'>
                    <div className='products-container__right__products-container__item__bottom__top__left'>
                        <p>{productInformation.categoryConnections.length > 0 ? productInformation.categoryConnections[0].category.CATEGORY_NAME : null}</p>
                    </div>
                </div>
                <div className='products-container__right__products-container__item__bottom__middle'>
                    <p>{productInformation.PRODUCT_NAME}</p>
                </div>
                <div className='products-container__right__products-container__item__bottom__bottom'>
                    <Rating
                        name="simple-controlled"
                        value={4}
                        readOnly
                        size='small'
                    />
                </div>
                <div className='products-container__right__products-container__item__bottom__price'>
                    <p>{formatter(productInformation.productPrices.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime())[0].UNIT_PRICE)}</p>
                </div>
            </div>
        </div >
    )
}

export default Item;