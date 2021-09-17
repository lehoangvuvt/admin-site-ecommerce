import { FC, useEffect, useState } from "react";
import { ProductAttributeValueType } from "../../../../types";
import { FormControl, InputLabel, OutlinedInput } from "@material-ui/core";
import axios from "axios";

type SubAttributePropsType = {
    selectedAttribute: ProductAttributeValueType | null,
    render: (value: boolean) => void,
    setTab: (value: number) => void,
}

const SubAttribute: FC<SubAttributePropsType> = ({ selectedAttribute, setTab, render }) => {
    const [attributeValue, setAttributeValue] = useState('');
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        if (selectedAttribute) {
            let value = null;
            let valueType = selectedAttribute.productAttribute.VALUE_TYPE;
            let quantity = selectedAttribute.product.QTY;
            if (valueType === 'VARCHAR') {
                value = selectedAttribute.VALUE_VARCHAR;
            } else if (valueType === 'DECIMAL') {
                value = selectedAttribute.VALUE_DECIMAL;
            } else if (valueType === 'INT') {
                value = selectedAttribute.VALUE_INT;
            } else {
                value = selectedAttribute.VALUE_DATETIME;
            }
            setAttributeValue(value.toString());
            setQuantity(quantity);
        }
    }, [selectedAttribute])

    const getAttributeInfo = () => {
        let valueType = 'text';
        let attributeName = 'default';
        if (selectedAttribute) {
            valueType = selectedAttribute.productAttribute.VALUE_TYPE;
            attributeName = selectedAttribute.productAttribute.LABEL_TEXT;
        }
        return {
            valueType,
            attributeName,
        }
    }

    const submit = async () => {
        if (selectedAttribute) {
            let newAttributeValue = null;
            const valueType = selectedAttribute.productAttribute.VALUE_TYPE;
            if (valueType === 'INT') {
                newAttributeValue = parseInt(attributeValue);
            } else if (valueType === 'DECIMAL') {
                newAttributeValue = parseFloat(attributeValue).toFixed(2);
            } else {
                newAttributeValue = attributeValue;
            }
            const body = {
                QTY: quantity,
                ATTRIBUTE_VALUE_ID: selectedAttribute.ID,
                NEW_ATTRIBUTE_VALUE: newAttributeValue,
            }
            const response = await axios({
                url: `http://localhost:5035/products/product/update/${selectedAttribute.SID_PRODUCT}`,
                method: 'PUT',
                data: body,
                withCredentials: true
            })
            const data = response.data;
            if (data.error) {
                alert('Cannot update product option details');
            } else {
                const product = data.product;
                alert('Update product option details success');
                render(true);
                setTab(1);
                setTab(2);
            }
        }
    }

    return (
        <div className='product-details-container__content__body'>
            <FormControl
                style={{ width: '100%' }}
                required
                variant="outlined">
                <InputLabel htmlFor="component-outlined">{getAttributeInfo().attributeName}</InputLabel>
                <OutlinedInput
                    required
                    type={getAttributeInfo().valueType === 'VARCHAR' ? 'text' : 'number'}
                    id="component-outlined"
                    value={attributeValue}
                    placeholder={`Enter ${getAttributeInfo().attributeName} value`}
                    onChange={(e) => { setAttributeValue(e.target.value) }}
                    label={getAttributeInfo().attributeName} />
            </FormControl>
            <br />
            <br />
            <FormControl
                style={{ width: '100%' }}
                required
                variant="outlined">
                <InputLabel htmlFor="component-outlined">Quantity</InputLabel>
                <OutlinedInput
                    required
                    type='number'
                    id="component-outlined"
                    value={quantity}
                    onChange={(e) => { setQuantity(parseInt(e.target.value)) }}
                    label='Quantity' />
            </FormControl>
            <br />
            <br />
            <div className='product-details-container__content__body__add-sub-attribute'>
                <button onClick={() => {
                    setTab(21);
                }}
                ><i className="fas fa-arrow-left"></i> Back</button>
                <button
                    style={{ width: '20%',height:'35px' }}
                    onClick={() => {
                        submit();
                    }}
                >Save</button>
            </div>
        </div>
    )
}

export default SubAttribute;