import { FC, useEffect, useState } from "react";
import { OptionType } from "./Product";
import { ProductAttributeValueType } from "../../../../types";
import { FormControl, InputLabel, OutlinedInput } from "@material-ui/core";
import { PRISM_URL } from "../../../../../constants/url.constants";

type OptionPropsType = {
    selectedOption: OptionType | null,
    setTab: (value: number) => void,
    setAttribute: (attribute: ProductAttributeValueType) => void,
}

const Option: FC<OptionPropsType> = ({ selectedOption, setTab, setAttribute }) => {
    const [mainAttributeValue, setMainAttributeValue] = useState('');

    const getAttributeValue = (groupProduct: ProductAttributeValueType) => {
        let value: any = null;
        if (groupProduct.VALUE_VARCHAR) value = groupProduct.VALUE_VARCHAR;
        if (groupProduct.VALUE_DECIMAL) value = groupProduct.VALUE_DECIMAL;
        if (groupProduct.VALUE_INT) value = groupProduct.VALUE_INT;
        if (groupProduct.VALUE_DATETIME) value = groupProduct.VALUE_DECIMAL;
        return value;
    }

    useEffect(() => {
        if (selectedOption) {
            setMainAttributeValue(selectedOption.GROUP_ATTRIBUTE_VALUE.toString());
        }
    }, [selectedOption])

    return (
        <div className='product-details-container__content__body'>
            <div className='product-details-container__content__body__attribute-set-table'>
                <br />
                <div className='product-details-container__content__body__add-sub-attribute'>
                    <button onClick={() => {
                        setTab(2);
                    }}
                    ><i className="fas fa-arrow-left"></i> Back</button>
                    <button
                        onClick={() => {
                            setTab(211);
                        }}
                    >Add New {selectedOption ? selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT : ''}</button>
                </div>
                <div className='product-details-container__content__body__option-details-container'>
                    <FormControl
                        style={{ width: '100%' }}
                        required
                        variant="outlined">
                        <InputLabel htmlFor="component-outlined">{selectedOption ? selectedOption.GROUP_ATTRIBUTE_NAME : ''}</InputLabel>
                        <OutlinedInput
                            required
                            type='text'
                            id="component-outlined"
                            value={mainAttributeValue}
                            onChange={(e) => { setMainAttributeValue(e.target.value) }}
                            label={selectedOption ? selectedOption.GROUP_ATTRIBUTE_NAME : ''} />
                    </FormControl>
                </div>
                <div className='product-details-container__content__body__attribute-set-table__title'>
                    <h1>{selectedOption ? `Current ${selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT}s:` : ''}</h1>
                </div>
                <div className='product-details-container__content__body__attribute-set-table__headers'>
                    <div className='product-details-container__content__body__attribute-set-table__headers__header1'>
                    </div>
                    <div style={{ width: '20%' }} className='product-details-container__content__body__attribute-set-table__headers__header2'>

                    </div>
                    <div style={{ width: '40%' }} className='product-details-container__content__body__attribute-set-table__headers__header3'>
                        <h1>{selectedOption?.groupedProducts[0].productAttribute.LABEL_TEXT}</h1>
                    </div>
                    <div className='product-details-container__content__body__attribute-set-table__headers__header4'>
                        <h1>Quantity</h1>
                    </div>
                    <div className='product-details-container__content__body__attribute-set-table__headers__header5'>
                    </div>
                </div>

                {selectedOption && selectedOption.groupedProducts.length > 0 ?
                    selectedOption.groupedProducts.map((groupProduct, i) =>
                        <div style={{ height: '80px' }} key={i} className='product-details-container__content__body__attribute-set-table__row'>
                            <div className='product-details-container__content__body__attribute-set-table__row__column1'>
                                <h1>{i + 1}</h1>
                            </div>
                            <div style={{ justifyContent: "center", width: '20%' }}
                                className='product-details-container__content__body__attribute-set-table__row__column2'>
                                <img src={
                                    groupProduct.product.images[0].PRISM_URL ?
                                        `${PRISM_URL}/images/${groupProduct.product.images[0].PRISM_URL}` :
                                        `http://localhost:5035/products/image/${groupProduct.product.images[0].IMAGE_NAME}`
                                } />
                            </div>
                            <div style={{ width: '40%' }} className='product-details-container__content__body__attribute-set-table__row__column3'>
                                <h1>{getAttributeValue(groupProduct)}</h1>
                            </div>
                            <div className='product-details-container__content__body__attribute-set-table__row__column4'>
                                <h1>{groupProduct.product.QTY}</h1>
                            </div>
                            <div className='product-details-container__content__body__attribute-set-table__row__column5'>
                                <i
                                    onClick={() => {
                                        setAttribute(groupProduct);
                                        setTab(212);
                                    }}
                                    className="far fa-edit"></i>
                            </div>
                        </div>
                    ) : null}
            </div>
        </div>
    )
}

export default Option;