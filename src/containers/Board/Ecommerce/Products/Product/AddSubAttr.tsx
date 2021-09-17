import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@material-ui/core";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { OptionType } from "./Product";
import { CreateAttributeValueType, CreateProductType, ProductAttributeType, ProductInformationType, ProductType } from "../../../../types";
import { useRouter } from "../../../../../hooks/router";

type AddSubAttrPropsType = {
    productInformation: ProductInformationType | null,
    selectedOption: OptionType | null,
    setTab: (value: number) => void,
}

const AddSubAttr: FC<AddSubAttrPropsType> = ({ selectedOption, setTab, productInformation }) => {
    const router = useRouter();
    const [image1, setImage1] = useState<FileList | null>(null);
    const [image2, setImage2] = useState<FileList | null>(null);
    const [image3, setImage3] = useState<FileList | null>(null);
    const [selectedAttribute, setSelectedAttribute] = useState(-1);
    const [attributes, setAttributes] = useState<Array<ProductAttributeType>>([]);
    const [attributeValue, setAttributeValue] = useState('');
    const [valueType, setValueType] = useState('text');
    const [attributeName, setAttributeName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [step, setStep] = useState(1);
    const [open, setOpen] = useState(false);

    const getAllAttributes = async () => {
        const response = await axios({
            url: 'http://localhost:5035/products/attributes',
            method: 'GET',
            withCredentials: true
        })
        const data = response.data;
        if (selectedOption) {
            setAttributes(data.attributes.filter((attribute: any) => attribute.ID !== selectedOption.GROUP_ATTRIBUTE_ID));
            setSelectedAttribute(data.attributes.filter((attribute: any) => attribute.ID === selectedOption.groupedProducts[0].productAttribute.ID)[0].ID);
            setAttributeName(data.attributes.filter((attribute: any) => attribute.ID === selectedOption.groupedProducts[0].productAttribute.ID)[0].ATTRIBUTE_NAME);
        }
    }

    useEffect(() => {
        getAllAttributes();
    }, [])

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };


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

    const createAttributeValue = async (SID_PRODUCT: string) => {
        if (selectedOption && productInformation) {
            let body: CreateAttributeValueType;
            const attributeId = selectedAttribute;
            const type = attributes.filter(attribute => attribute.ID === selectedAttribute)[0].VALUE_TYPE;
            if (type === 'DECIMAL') {
                body = {
                    SID_PRODUCT,
                    PRODUCT_ATTRIBUTE_ID: attributeId,
                    PRODUCT_ATTRIBUTE_GROUP_ID: selectedOption.GROUP_ID,
                    VALUE_DECIMAL: parseFloat(attributeValue)
                }
            } else if (type === 'INT') {
                body = {
                    SID_PRODUCT,
                    PRODUCT_ATTRIBUTE_ID: attributeId,
                    PRODUCT_ATTRIBUTE_GROUP_ID: selectedOption.GROUP_ID,
                    VALUE_INT: parseInt(attributeValue)
                }
            } else {
                body = {
                    SID_PRODUCT,
                    PRODUCT_ATTRIBUTE_ID: attributeId,
                    PRODUCT_ATTRIBUTE_GROUP_ID: selectedOption.GROUP_ID,
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
    }

    const create = async (e: any) => {
        e.preventDefault();
        let isExisted = false;
        if (selectedOption) {
            const createProductRes = await createProduct();
            if (createProductRes && createProductRes.error) return;
            if (createProductRes && createProductRes.product) {
                const product = createProductRes.product;
                const addImagesRes = await addImages(product.SID);
                if (!addImagesRes) return;
                const createAttributeValueRes = await createAttributeValue(product.SID);
                if (createAttributeValueRes && createAttributeValueRes.error) return;
                if (createAttributeValueRes && createAttributeValueRes.newAttributeValue) {
                    alert('Success');
                    router.push('/e-commerce/products?q=*&page=2&sort=default');
                }
            }
        }
        e.preventDefault();
    }

    const checkIfExisted = async () => {
        let isExisted = false;
        if (selectedOption) {
            const products = selectedOption.groupedProducts;
            const checkIfExisted = products.map(product => {
                const valueType = product.productAttribute.VALUE_TYPE;
                let existedAttributeValue = null;
                if (valueType === 'VARCHAR') existedAttributeValue = product.VALUE_VARCHAR;
                if (valueType === 'INT') existedAttributeValue = product.VALUE_INT;
                if (valueType === 'DECIMAL') existedAttributeValue = product.VALUE_DECIMAL;
                if (valueType === 'DATETIME') existedAttributeValue = product.VALUE_DATETIME;
                const attributeId = product.productAttribute.ID;
                if (valueType === 'DECIMAL') {
                    if (attributeId === selectedAttribute && existedAttributeValue === parseFloat(attributeValue).toFixed(2)) {
                        isExisted = true;
                    }
                } else if (valueType === 'INT') {
                    if (attributeId === selectedAttribute && existedAttributeValue === parseInt(attributeValue)) {
                        isExisted = true;
                    }
                } else {
                    if (attributeId === selectedAttribute && existedAttributeValue?.toString().toLowerCase() === attributeValue.toLowerCase()) {
                        isExisted = true;
                    }
                }
                return isExisted;
            });
            await Promise.all(checkIfExisted);
        }
        return isExisted;
    }

    useEffect(() => {
        if (selectedAttribute !== -1) {
            const type = attributes.filter(attribute => attribute.ID === selectedAttribute)[0].VALUE_TYPE;
            const name = attributes.filter(attribute => attribute.ID === selectedAttribute)[0].ATTRIBUTE_NAME;
            setAttributeName(name);
            if (type === 'VARCHAR') {
                setValueType('text');
            } else if (type === 'DECIMAL' || type === 'INT') {
                setValueType('number');
            }
        }
    }, [selectedAttribute])

    return (
        <div className='product-details-container__content__body'>
            <div className='product-details-container__content__body__title'>
                {step === 1 ? <h1>Step 1: Input {selectedOption ? selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT : ''} value</h1> : null}
                {step === 2 ? <h1>Step 2: Upload pictures</h1> : null}
            </div>
            <div className='product-details-container__content__body__add-sub-attr-container'>
                {step === 1 ?
                    <>
                        {/* <FormControl
                            style={{ width: '100%' }}
                        >
                            <InputLabel htmlFor="component-outlined">Attribute name</InputLabel>
                            <Select
                                id="component-outlined"
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                value={selectedAttribute}
                                onChange={(e) => {
                                    setSelectedAttribute(e.target.value as number);
                                }}
                            >
                                {attributes.length > 0 && selectedOption ?
                                    attributes.filter(attribute => attribute.ID === selectedOption.groupedProducts[0].productAttribute.ID).map(attribute =>
                                        <MenuItem value={attribute.ID}>
                                            {attribute.ATTRIBUTE_NAME}
                                        </MenuItem>
                                    )
                                    : null}
                            </Select>
                        </FormControl> */}
                        {/* <br />
                        <br /> */}
                        <FormControl
                            style={{ width: '100%' }}
                            required
                            variant="outlined">
                            <InputLabel htmlFor="component-outlined">{selectedOption ? selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT : ''}</InputLabel>
                            <OutlinedInput
                                required
                                type={valueType}
                                id="component-outlined"
                                placeholder={`Enter ${selectedOption ? selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT : ''}`}
                                value={attributeValue}
                                onChange={(e) => { setAttributeValue(e.target.value) }}
                                label={`${selectedOption ? selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT : ''}`} />
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
                                onChange={(e) => { setQuantity(parseInt(e.target.value.toString())) }}
                                label='Quantity' />
                        </FormControl>
                    </>
                    : null}

                {step === 2 ?
                    <div className='product-details-container__content__body__add-sub-attr-container__images-container' style={{ justifyContent: 'space-between' }}>
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
            </div>
            <br />
            <br />
            {step === 1 ?
                <div className='product-details-container__content__body__add-sub-attribute'>
                    <button onClick={() => {
                        setTab(21);
                    }}
                    ><i className="fas fa-arrow-left"></i> Back</button>
                    <button
                        onClick={async (e) => {
                            const isExisted = await checkIfExisted();
                            if (isExisted) return alert(`This ${selectedOption ? selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT : ''} is already existed`);;
                            setStep(2);
                        }}
                    >Next Step</button>
                </div>
                :
                <div className='product-details-container__content__body__add-sub-attribute'>
                    <button onClick={() => {
                        setStep(1);
                    }}
                    ><i className="fas fa-arrow-left"></i> Back</button>
                    <button
                        onClick={(e) => {
                            create(e);
                        }}
                    >Add {selectedOption ? selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT : ''}</button>
                </div>
            }
        </div>
    )
}

export default AddSubAttr