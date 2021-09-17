import React, { createRef, FC, useEffect, useRef, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from 'axios';
import { actions } from './actions';
import { connect } from 'react-redux';
import Info from '../../../../../components/Tooptip/Info';
import { RootReducerType } from '../../../../reducer';
import { TextField, Typography } from '@material-ui/core';
import { tooltipContents } from '../../../../../data/tooltip_content';
import { CreateAttributeGroupType, CreateAttributeValueType, CreateProductType, ProductAttributeGroupType, ProductAttributeType, ProductInformationType, ProductType } from '../../../../types';
import { useRouter } from '../../../../../hooks/router';

const mapDispatchToProps = {
    setStep: actions.setStep,
    resetCreateProduct: actions.resetCreateProduct,
}

const mapStateToProps = (state: RootReducerType) => {
    return {
        createProductState: state.createProduct,
    }
}

type CreateAttributeValuePropsType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const CreateProductOption: FC<CreateAttributeValuePropsType> = ({ setStep, resetCreateProduct, createProductState }) => {
    const router = useRouter();
    const { productInformation, selectedAttributeSet } = createProductState;
    const [groupAttributeValues, setGroupAttributeValues] = useState<Array<any>>([]);
    const [attributeValues, setAttributeValues] = useState<Array<any>>([]);
    const [attribute1Value, setAttribute1Value] = useState('');
    const [attribute2Value, setAttribute2Value] = useState('');
    const [image1, setImage1] = useState<FileList | null>(null);
    const [image2, setImage2] = useState<FileList | null>(null);
    const [image3, setImage3] = useState<FileList | null>(null);
    const [quantity, setQuantity] = useState(0);
    let quantityRef: React.RefObject<HTMLInputElement>;
    quantityRef = createRef();

    const handleFocus = (ref: React.RefObject<any>) => {
        if (ref && ref.current) ref.current.style.border = '2px solid #3f51b5';
    }

    const handleBlur = (ref: React.RefObject<any>) => {
        if (ref && ref.current) ref.current.style.border = '1px solid rgba(0,0,0,0.3)';
    }

    const createAttributeGroup = async () => {
        if (selectedAttributeSet && productInformation) {
            let body: CreateAttributeGroupType;
            const groupAttributeId = selectedAttributeSet.productAttribute1.ID;
            const groupValueType = selectedAttributeSet.productAttribute1.VALUE_TYPE;
            if (groupValueType === 'DECIMAL') {
                body = {
                    GROUP_ATTRIBUTE_ID: groupAttributeId,
                    PRODUCT_INFORMATION_SID: productInformation.SID,
                    GROUP_VALUE_DECIMAL: parseFloat(attribute1Value)
                }
            } else if (groupValueType === 'INT') {
                body = {
                    GROUP_ATTRIBUTE_ID: groupAttributeId,
                    PRODUCT_INFORMATION_SID: productInformation.SID,
                    GROUP_VALUE_INT: parseInt(attribute1Value)
                }
            } else {
                body = {
                    GROUP_ATTRIBUTE_ID: groupAttributeId,
                    PRODUCT_INFORMATION_SID: productInformation.SID,
                    GROUP_VALUE_VARCHAR: attribute1Value
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
    }

    const createAttributeValue = async (GROUP_ID: number, SID_PRODUCT: string) => {
        if (selectedAttributeSet && productInformation) {
            let body: CreateAttributeValueType;
            const attributeId = selectedAttributeSet.productAttribute2.ID;
            const attributeValueType = selectedAttributeSet.productAttribute2.VALUE_TYPE;
            if (attributeValueType === 'DECIMAL') {
                body = {
                    SID_PRODUCT,
                    PRODUCT_ATTRIBUTE_ID: attributeId,
                    PRODUCT_ATTRIBUTE_GROUP_ID: GROUP_ID,
                    VALUE_DECIMAL: parseFloat(attribute2Value)
                }
            } else if (attributeValueType === 'INT') {
                body = {
                    SID_PRODUCT,
                    PRODUCT_ATTRIBUTE_ID: attributeId,
                    PRODUCT_ATTRIBUTE_GROUP_ID: GROUP_ID,
                    VALUE_INT: parseInt(attribute2Value)
                }
            } else {
                body = {
                    SID_PRODUCT,
                    PRODUCT_ATTRIBUTE_ID: attributeId,
                    PRODUCT_ATTRIBUTE_GROUP_ID: GROUP_ID,
                    VALUE_VARCHAR: attribute2Value
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
    }


    const createProduct = async () => {
        if (productInformation) {
            let createProductInfo: CreateProductType;
            createProductInfo = {
                QTY: quantity,
                SID_PRODUCT_INFORMATION: productInformation.SID
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
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
                    resetCreateProduct();
                    router.push('/e-commerce/products?q=*&page=1');
                }
            }
        }
        e.preventDefault();
    }

    useEffect(() => {
        if (selectedAttributeSet) {
            const getAttributeValues = async () => {
                const body = {
                    groupAttributeId: selectedAttributeSet.productAttribute1.ID,
                    attributeId: selectedAttributeSet.productAttribute2.ID,
                }
                const response = await axios({
                    url: `http://localhost:5035/products/attribute/values`,
                    method: 'POST',
                    data: body,
                })
                const data = response.data;
                setGroupAttributeValues(data.groupAttributeValues);
                setAttributeValues(data.attributeValues);
            }
            getAttributeValues();
        }
    }, [])

    return (
        <div className='create-product-container'>
            {selectedAttributeSet && productInformation ?
                <form onSubmit={handleSubmit}>
                    <div
                        className='create-product-container__field-container'>
                        <div className='create-product-container__field-container__label'>
                            <i
                                onClick={() => { setStep(1) }}
                                style={{ cursor: 'pointer' }}
                                className="fas fa-chevron-left"></i>
                        </div>
                    </div>

                    <div className='create-product-container__field-container'>
                        <div className='create-product-container__field-container__label'>
                            <p>{selectedAttributeSet.productAttribute1.ATTRIBUTE_NAME} value:</p>
                        </div>
                        <div className='create-product-container__field-container__input'>
                            <Autocomplete
                                renderOption={(option) => (
                                    <Typography
                                        style={{ fontSize: "1rem" }}>
                                        {option}</Typography>
                                )}
                                id="combo-box-store"
                                value={attribute1Value}
                                onChange={(event: any, newValue: any) => {
                                    setAttribute1Value(newValue);
                                }}
                                freeSolo
                                onInputChange={(e: any) => {
                                    setAttribute1Value(e.target.value);
                                }}
                                options={groupAttributeValues}
                                getOptionLabel={(option) => option}
                                style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} size="medium" label="" variant="outlined" />}
                            />
                        </div>
                        {/* <div className='create-product-container__field-container__error'>
                        <p></p>
                    </div> */}
                    </div>

                    <div className='create-product-container__field-container'>
                        <div className='create-product-container__field-container__label'>
                            <p>{selectedAttributeSet.productAttribute2.ATTRIBUTE_NAME} value:</p>
                        </div>
                        <div className='create-product-container__field-container__input'>
                            <Autocomplete
                                renderOption={(option) => (
                                    <Typography
                                        style={{ fontSize: "0.9rem" }}>
                                        {option}</Typography>
                                )}
                                id="combo-box-store"
                                value={attribute2Value}
                                onChange={(event: any, newValue: any) => {
                                    setAttribute2Value(newValue);
                                }}
                                freeSolo
                                onInputChange={(e: any) => {
                                    setAttribute2Value(e.target.value);
                                }}
                                options={attributeValues}
                                getOptionLabel={(option) => option}
                                style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} size="medium" label="" variant="outlined" />}
                            />
                        </div>
                        {/* <div className='create-product-container__field-container__error'>
                        <p></p>
                    </div> */}
                    </div>

                    <div className='create-product-container__field-container'>
                        <div className='create-product-container__field-container__label'>
                            <p>Quantity:</p>
                        </div>
                        <div className='create-product-container__field-container__input'>
                            <input
                                style={{
                                    transition: 'none',
                                    height: '55px ', 'border': "1px solid rgba(0,0,0,0.3)",
                                    boxSizing: 'border-box',
                                    fontSize: '0.95rem',
                                }}
                                value={quantity}
                                onChange={(e) => { setQuantity(parseInt(e.target.value)) }}
                                onFocus={() => { handleFocus(quantityRef) }}
                                onBlur={() => { handleBlur(quantityRef) }}
                                ref={quantityRef}
                                type='number' />
                        </div>
                        {/* <div className='create-product-container__field-container__error'>
                        <p></p>
                    </div> */}
                    </div>
                    <div id='splitter'></div>
                    <div
                        style={{ marginTop: '50px' }}
                        className='create-product-container__field-container'>
                        <div className='create-product-container__field-container__label'>
                            <p>Product images</p>
                            <Info content={tooltipContents.productImages} />
                        </div>
                        <div
                            style={{ justifyContent: 'space-between' }}
                            className='create-product-container__field-container__input'>
                            <div
                                onClick={() => {
                                    const input = document.getElementById('upload-image-1');
                                    if (input) input.click();
                                }}
                                className='create-product-container__field-container__input__upload-img'>
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
                                className='create-product-container__field-container__input__upload-img'>
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
                                className='create-product-container__field-container__input__upload-img'>
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
                    </div>

                    <div className='create-product-container__btn-container'>
                        <button type='submit'>
                            Add product option
                        </button>
                    </div>
                </form>
                :
                null
            }
        </div >
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductOption);