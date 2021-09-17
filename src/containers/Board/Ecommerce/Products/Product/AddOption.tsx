import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@material-ui/core";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { AttributeSetType, CreateAttributeGroupType, CreateAttributeValueType, CreateProductType, ProductAttributeGroupType, ProductAttributeType, ProductType } from "../../../../types";
import { OptionType } from "./Product";

type AddOptionPropsType = {
    setTab: (value: number) => void,
    productByGroupedAttribute: Array<OptionType>,
}

const AddOption: FC<AddOptionPropsType> = ({ setTab, productByGroupedAttribute }) => {
    const [attributeSets, setAttributeSets] = useState<Array<AttributeSetType>>([]);
    const [mainAttributeValue, setMainAttributeValue] = useState('');
    const [subAttributeValue, setSubAttributeValue] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [image1, setImage1] = useState<FileList | null>(null);
    const [image2, setImage2] = useState<FileList | null>(null);
    const [image3, setImage3] = useState<FileList | null>(null);
    const [step, setStep] = useState(1);

    const getAttributesInfo = () => {
        const mainAttributeName = productByGroupedAttribute[0].GROUP_ATTRIBUTE_NAME;
        const mainAttributeValueType = productByGroupedAttribute[0].GROUP_ATTRIBUTE_VALUE_TYPE;
        const subAttributeName = productByGroupedAttribute[0].groupedProducts[0].productAttribute.LABEL_TEXT;
        const subAttributeValueType = productByGroupedAttribute[0].groupedProducts[0].productAttribute.VALUE_TYPE;
        const mainAttribute = {
            valueType: mainAttributeValueType,
            attributeName: mainAttributeName,
        }
        const subAttribute = {
            valueType: subAttributeValueType,
            attributeName: subAttributeName,
        }
        return {
            mainAttribute,
            subAttribute,
        }
    }

    const createAttributeGroup = async () => {
        let body: CreateAttributeGroupType;
        const groupAttributeId = productByGroupedAttribute[0].GROUP_ATTRIBUTE_ID;
        const groupValueType = productByGroupedAttribute[0].GROUP_ATTRIBUTE_VALUE_TYPE;
        const attributeValue = mainAttributeValue;
        if (groupValueType === 'DECIMAL') {
            body = {
                GROUP_ATTRIBUTE_ID: groupAttributeId,
                PRODUCT_INFORMATION_SID: productByGroupedAttribute[0].groupedProducts[0].product.SID_PRODUCT_INFORMATION,
                GROUP_VALUE_DECIMAL: parseFloat(attributeValue)
            }
        } else if (groupValueType === 'INT') {
            body = {
                GROUP_ATTRIBUTE_ID: groupAttributeId,
                PRODUCT_INFORMATION_SID: productByGroupedAttribute[0].groupedProducts[0].product.SID_PRODUCT_INFORMATION,
                GROUP_VALUE_INT: parseInt(attributeValue)
            }
        } else {
            body = {
                GROUP_ATTRIBUTE_ID: groupAttributeId,
                PRODUCT_INFORMATION_SID: productByGroupedAttribute[0].groupedProducts[0].product.SID_PRODUCT_INFORMATION,
                GROUP_VALUE_VARCHAR: attributeValue
            }
        }
        const response = await axios({
            url: `http://localhost:5035/products/attribute-group/create`,
            method: 'POST',
            data: body,
            withCredentials: true
        })
        let newAttributeGroup: ProductAttributeGroupType;
        const data = response.data;
        if (data.error) {
            console.log(data.error);
            return {
                error: data.error
            }
        } else {
            newAttributeGroup = data.newAttributeGroup;
            return { newAttributeGroup };
        }
    }

    const createAttributeValue = async (GROUP_ID: number, SID_PRODUCT: string) => {
        let body: CreateAttributeValueType;
        const attributeId = productByGroupedAttribute[0].groupedProducts[0].productAttribute.ID;
        const attributeValueType = productByGroupedAttribute[0].groupedProducts[0].productAttribute.VALUE_TYPE;
        const attributeValue = subAttributeValue;
        if (attributeValueType === 'DECIMAL') {
            body = {
                SID_PRODUCT,
                PRODUCT_ATTRIBUTE_ID: attributeId,
                PRODUCT_ATTRIBUTE_GROUP_ID: GROUP_ID,
                VALUE_DECIMAL: parseFloat(attributeValue)
            }
        } else if (attributeValueType === 'INT') {
            body = {
                SID_PRODUCT,
                PRODUCT_ATTRIBUTE_ID: attributeId,
                PRODUCT_ATTRIBUTE_GROUP_ID: GROUP_ID,
                VALUE_INT: parseInt(attributeValue)
            }
        } else {
            body = {
                SID_PRODUCT,
                PRODUCT_ATTRIBUTE_ID: attributeId,
                PRODUCT_ATTRIBUTE_GROUP_ID: GROUP_ID,
                VALUE_VARCHAR: attributeValue
            }
        }
        const response = await axios({
            url: `http://localhost:5035/products/attribute-value/create`,
            method: 'POST',
            data: body,
            withCredentials: true
        })
        let newAttributeValue: ProductAttributeType;
        const data = response.data;
        if (data.error) return { error: data.error };
        newAttributeValue = data.newAttributeValue;
        return { newAttributeValue };
    }


    const createProduct = async () => {
        let createProductInfo: CreateProductType;
        createProductInfo = {
            QTY: quantity,
            SID_PRODUCT_INFORMATION: productByGroupedAttribute[0].groupedProducts[0].product.SID_PRODUCT_INFORMATION
        };

        const response = await axios({
            url: `http://localhost:5035/products/product/create`,
            method: 'POST',
            data: createProductInfo,
            withCredentials: true
        })
        let product: ProductType;
        const data = response.data;
        if (data.error) return { error: data.error };
        product = data.product;
        return { product };
    }

    const addImages = async (PRODUCT_SID: string) => {
        let isSuccess = true;
        if (image1 && image2 && image3) {
            const file1 = image1[0];
            const file2 = image2[0];
            const file3 = image3[0];
            let data = new FormData();
            data.append('PRODUCT_SID', PRODUCT_SID);
            data.append('files', file1);
            data.append('files', file2);
            data.append('files', file3);
            const response = await axios.post('http://localhost:5035/products/add-images', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            })
            const createImgsData = response.data;
        }
        return isSuccess;
    }

    const checkIfExisted = () => {
        let isExisted = false;
        const check = productByGroupedAttribute.map(product => {
            const valueType = product.GROUP_ATTRIBUTE_VALUE_TYPE;
            const value = product.GROUP_ATTRIBUTE_VALUE;
            let attributeValue = null;
            if (valueType === 'DECIMAL') {
                attributeValue = parseFloat(mainAttributeValue.toString()).toFixed(2);
            } else if (valueType === 'INT') {
                attributeValue = parseInt(mainAttributeValue.toString());
            } else {
                attributeValue = mainAttributeValue;
            }
            if (valueType === 'VARCHAR') {
                if (value.toString().toLowerCase() === attributeValue.toString().toLowerCase()) {
                    isExisted = true;
                }
            } else {
                if (value === attributeValue) {
                    isExisted = true;
                }
            }
            return isExisted;
        })
        return isExisted;
    }

    const submit = async () => {
        const createProductRes = await createProduct();
        if (createProductRes && createProductRes.error) return;
        if (createProductRes && createProductRes.product) {
            const product = createProductRes.product;
            const addImagesRes = await addImages(product.SID);
            if (!addImagesRes) return;
            const createAttributeGroupRes = await createAttributeGroup();
            if (createAttributeGroupRes && createAttributeGroupRes.error) return;
            if (createAttributeGroupRes && createAttributeGroupRes.newAttributeGroup) {
                const attributeGroupId = createAttributeGroupRes.newAttributeGroup.ID;
                const createAttributeValueRes = await createAttributeValue(attributeGroupId, product.SID);
                if (createAttributeValueRes && createAttributeValueRes.error) return;
                if (createAttributeValueRes && createAttributeValueRes.newAttributeValue) {
                    alert('Success');
                }
            }
        }
    }

    return (
        <div className='product-details-container__content__body'>
            <div className='product-details-container__content__body__title'>
                {step === 1 ? <h1>Step 1: Input option info</h1> : null}
                {step === 2 ? <h1>Step 2: Upload option's pictures</h1> : null}
            </div>
            {step === 1 ?
                <>
                    <FormControl
                        style={{ width: '100%' }}
                        required
                        variant="outlined">
                        <InputLabel htmlFor="component-outlined">{getAttributesInfo().mainAttribute.attributeName}</InputLabel>
                        <OutlinedInput
                            required
                            type={getAttributesInfo().mainAttribute.valueType === 'VARCHAR' ? 'text' : 'number'}
                            id="component-outlined"
                            value={mainAttributeValue}
                            onChange={(e) => { setMainAttributeValue(e.target.value) }}
                            placeholder={`Enter ${getAttributesInfo().mainAttribute.attributeName} value`}
                            label={getAttributesInfo().mainAttribute.attributeName} />
                    </FormControl>
                    <br />
                    <FormControl
                        style={{ width: '100%' }}
                        required
                        variant="outlined">
                        <InputLabel htmlFor="component-outlined">{getAttributesInfo().subAttribute.attributeName}</InputLabel>
                        <OutlinedInput
                            required
                            type={getAttributesInfo().subAttribute.valueType === 'VARCHAR' ? 'text' : 'number'}
                            id="component-outlined"
                            value={subAttributeValue}
                            onChange={(e) => { setSubAttributeValue(e.target.value) }}
                            placeholder={`Enter ${getAttributesInfo().subAttribute.attributeName} value`}
                            label={getAttributesInfo().subAttribute.attributeName} />
                    </FormControl>
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
                </>
                : null}

            {step === 2 ?
                <div className='product-details-container__content__body__add-sub-attr-container__images-container'
                    style={{ justifyContent: 'space-between', marginTop: '-10px' }}>
                    <div
                        onClick={() => {
                            const input = document.getElementById('upload-image-1');
                            if (input) input.click();
                        }}
                        className='product-details-container__content__body__add-sub-attr-container__images-container__upload-img'>
                        {image1 ? <img src={URL.createObjectURL(image1[0])} /> : null}
                        <input
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files) {
                                    setImage1(e.target.files);
                                }
                            }}
                            id='upload-image-1'
                            type="file"
                            name="image"
                            accept="image/*"
                            className="input-group input-file" />
                        <i className="far fa-image"></i>
                        <p>Click here to select your image</p>
                    </div>

                    <div
                        onClick={() => {
                            const input = document.getElementById('upload-image-2');
                            if (input) input.click();
                        }}
                        className='product-details-container__content__body__add-sub-attr-container__images-container__upload-img'>
                        {image2 ? <img src={URL.createObjectURL(image2[0])} /> : null}
                        <input
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files) {
                                    setImage2(e.target.files);
                                }
                            }}
                            accept="image/*"
                            id='upload-image-2'
                            type="file"
                            name="image"
                            className="input-group input-file" />
                        <i className="far fa-image"></i>
                        <p>Click here to select your image</p>
                    </div>

                    <div
                        onClick={() => {
                            const input = document.getElementById('upload-image-3');
                            if (input) input.click();
                        }}
                        className='product-details-container__content__body__add-sub-attr-container__images-container__upload-img'>
                        {image3 ? <img src={URL.createObjectURL(image3[0])} /> : null}
                        <input
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files) {
                                    setImage3(e.target.files);
                                }
                            }}
                            accept="image/*"
                            id='upload-image-3'
                            type="file"
                            name="image"
                            className="input-group input-file" />
                        <i className="far fa-image"></i>
                        <p>Click here to select your image</p>
                    </div>

                </div>
                : null}
            <br />
            <br />
            <div className='product-details-container__content__body__add-sub-attribute'>
                <button
                    onClick={(e) => {
                        if (step === 1) {
                            setTab(2);
                        } else {
                            setStep(oldStep => oldStep - 1);
                        }
                    }}
                ><i className="fas fa-arrow-left"></i> Back</button>
                {step === 1 ?
                    <button
                        onClick={() => {
                            if (!checkIfExisted()) {
                                setStep(oldStep => oldStep + 1);
                            } else {
                                alert(`This ${getAttributesInfo().mainAttribute.attributeName} attribute value is already existed`)
                            }
                        }}
                    >Next step</button>
                    :
                    <button
                        onClick={() => {
                            submit();
                        }}
                    >Create Option</button>}
            </div>
        </div>
    )
}

export default AddOption;