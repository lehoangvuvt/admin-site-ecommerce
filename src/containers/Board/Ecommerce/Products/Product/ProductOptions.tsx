import { FC, useEffect } from "react";
import { OptionType } from "./Product";
import { ProductAttributeValueType, ProductInformationType } from "../../../../types";

type ProductOptionsPropsType = {
    productByGroupedAttribute: Array<OptionType>,
    setTab: (value: number) => void,
    setOption: (option: OptionType) => void,
}
const ProductOptions: FC<ProductOptionsPropsType> = ({ productByGroupedAttribute, setTab, setOption }) => {
    return (
        <div className='product-details-container__content__body'>
            <div className='product-details-container__content__body__add-option'>
                <button
                    onClick={(e) => {
                        setTab(22);
                    }}
                >Add New Option</button>
            </div>
            <br />
            <div className='product-details-container__content__body__attribute-set-table'>
                <div className='product-details-container__content__body__attribute-set-table__headers'>
                    <div className='product-details-container__content__body__attribute-set-table__headers__header1'>
                    </div>
                    <div className='product-details-container__content__body__attribute-set-table__headers__header2'>
                        <h1>{productByGroupedAttribute[0].GROUP_ATTRIBUTE_NAME}</h1>
                    </div>
                    <div className='product-details-container__content__body__attribute-set-table__headers__header3'>
                        <h1>{productByGroupedAttribute[0].groupedProducts[0].productAttribute.LABEL_TEXT}</h1>
                    </div>
                    <div className='product-details-container__content__body__attribute-set-table__headers__header4'>
                        <h1>Quantity</h1>
                    </div>
                    <div className='product-details-container__content__body__attribute-set-table__headers__header5'>
                    </div>
                </div>

                {productByGroupedAttribute.length > 0 ?
                    productByGroupedAttribute.map((product, i) =>
                        <div key={i} className='product-details-container__content__body__attribute-set-table__row'>
                            <div className='product-details-container__content__body__attribute-set-table__row__column1'>
                                <h1>{i + 1}</h1>
                            </div>
                            <div className='product-details-container__content__body__attribute-set-table__row__column2'>
                                <h1>{product.GROUP_ATTRIBUTE_VALUE}</h1>
                            </div>
                            <div className='product-details-container__content__body__attribute-set-table__row__column3'>
                                <h1>{product.groupedProducts.map((groupProduct: any, i) => i < product.groupedProducts.length - 1 ? groupProduct[`VALUE_${groupProduct.productAttribute.VALUE_TYPE}`] + ', '
                                    :
                                    groupProduct[`VALUE_${groupProduct.productAttribute.VALUE_TYPE}`]
                                )}</h1>
                            </div>
                            <div className='product-details-container__content__body__attribute-set-table__row__column4'>
                                <h1>{product.groupedProducts.reduce((total, groupedProduct) => total + groupedProduct.product.QTY, 0)}</h1>
                            </div>
                            <div className='product-details-container__content__body__attribute-set-table__row__column5'>
                                <i
                                    onClick={() => {
                                        setOption(product);
                                        setTab(21);
                                    }}
                                    className="far fa-edit"></i>
                            </div>
                        </div>
                    ) : null}
            </div>
        </div>
    )
}

export default ProductOptions;