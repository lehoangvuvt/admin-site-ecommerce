import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@material-ui/core";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useRouter } from "../../../../../hooks/router";
import { ProductBrandType, ProductInformationType } from "../../../../types";

type InformationPropsType = {
    productInformation: ProductInformationType | null,
    render: (value: boolean) => void,
}

const Information: FC<InformationPropsType> = ({ productInformation, render }) => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [tax, setTax] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const [openBrand, setOpenBrand] = useState(false);
    const [openGender, setOpenGender] = useState(false);
    const [currentBrand, setCurrentBrand] = useState('');
    const [productGender, setProductGender] = useState('');
    const [brands, setBrands] = useState<Array<ProductBrandType>>([]);

    const handleCloseBrand = () => {
        setOpenBrand(false);
    };

    const handleOpenBrand = () => {
        setOpenBrand(true);
    };

    const handleCloseGender = () => {
        setOpenGender(false);
    };

    const handleOpenGender = () => {
        setOpenGender(true);
    };

    const getBrands = async () => {
        const response = await axios({
            url: 'http://localhost:5035/products/brands',
            method: 'GET',
            withCredentials: true
        })
        const data = response.data;
        setBrands(data.brands);
    }

    useEffect(() => {
        getBrands();
    }, [])

    useEffect(() => {
        if (productInformation) {
            setName(productInformation.PRODUCT_NAME);
            const productPrice = productInformation.productPrices.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime())[0];
            const price = productPrice.UNIT_PRICE;
            const tax = productPrice.TAX;
            setPrice(price);
            setTax(tax);
            setThreshold(productInformation.THRESHOLD);
            setCurrentBrand(productInformation.SID_BRAND);
            setProductGender(productInformation.PRODUCT_GENDER);
        }
    }, [productInformation])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (productInformation) {
            let body: {
                PRODUCT_NAME: string,
                THRESHOLD: number,
                BRAND_SID: string,
                PRODUCT_GENDER: string,
                UNIT_PRICE?: number,
                TAX?: number;
            };
            body = {
                PRODUCT_NAME: name,
                THRESHOLD: threshold,
                BRAND_SID: currentBrand,
                PRODUCT_GENDER: productGender,
            }
            const productPrice = productInformation.productPrices.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime())[0];
            if (Number.parseFloat(price.toString()).toFixed(2) !== productPrice.UNIT_PRICE.toString()) {
                body.UNIT_PRICE = price;
            }
            if (Number.parseFloat(tax.toString()).toFixed(2) !== productPrice.TAX.toString()) {
                body.TAX = tax;
            }
            const response = await axios({
                url: `http://localhost:5035/products/product-information/update/${productInformation.SID}`,
                method: 'PUT',
                data: body,
                withCredentials: true,
            })
            const data = response.data;
            if (data.error) {
                alert('Cannot update product information');
            } else {
                alert('Success');
                render(true);
            }
        }
        e.preventDefault();
    }

    return (
        productInformation ?
            <div className='product-details-container__content__body'>
                <form onSubmit={handleSubmit}>
                    <FormControl
                        style={{ width: '100%' }}
                        required
                        variant="outlined">
                        <InputLabel htmlFor="component-outlined">Name</InputLabel>
                        <OutlinedInput
                            required
                            type='text'
                            id="component-outlined"
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                            label="Name" />
                    </FormControl>

                    <FormControl
                        style={{ width: '100%' }}
                        required
                        variant="outlined">
                        <InputLabel htmlFor="component-outlined">Price</InputLabel>
                        <OutlinedInput
                            required
                            type="number"
                            id="component-outlined"
                            value={price}
                            onChange={(e) => {
                                setPrice(parseFloat(e.target.value));
                            }}
                            label="Price" />
                    </FormControl>

                    <FormControl
                        style={{ width: '100%' }}
                        required
                        variant="outlined">
                        <InputLabel htmlFor="component-outlined">Tax</InputLabel>
                        <OutlinedInput
                            required
                            type="number"
                            id="component-outlined"
                            value={tax}
                            onChange={(e) => {
                                setTax(parseFloat(e.target.value));
                            }}
                            label="Tax" />
                    </FormControl>

                    <FormControl
                        style={{ width: '100%' }}
                        required
                        variant="outlined">
                        <InputLabel htmlFor="component-outlined">Threshold</InputLabel>
                        <OutlinedInput
                            required
                            type="number"
                            id="component-outlined"
                            value={threshold}
                            onChange={(e) => {
                                setThreshold(parseFloat(e.target.value));
                            }}
                            label="Threshold" />
                    </FormControl>

                    <FormControl
                        style={{ width: '100%' }}
                    >
                        <InputLabel htmlFor="component-outlined">Brand</InputLabel>
                        <Select
                            id="component-outlined"
                            open={openBrand}
                            onClose={handleCloseBrand}
                            onOpen={handleOpenBrand}
                            value={currentBrand}
                            onChange={(e) => {
                                setCurrentBrand(e.target.value as string);
                            }}
                        >
                            {brands.length > 0 ?
                                brands.map(brand =>
                                    <MenuItem value={brand.SID}>
                                        {brand.NAME}
                                    </MenuItem>
                                )
                                : null}
                        </Select>
                    </FormControl>

                    <FormControl
                        style={{ width: '100%' }}
                    >
                        <InputLabel htmlFor="component-outlined">Product for</InputLabel>
                        <Select
                            id="component-outlined"
                            open={openGender}
                            onClose={handleCloseGender}
                            onOpen={handleOpenGender}
                            value={productGender}
                            onChange={(e) => {
                                setProductGender(e.target.value as string);
                            }}
                        >
                            <MenuItem value={'Men'}>Men</MenuItem>
                            <MenuItem value={'Women'}>Women</MenuItem>
                            <MenuItem value={'Both'}>Both (Men and Women)</MenuItem>
                        </Select>
                    </FormControl>
                    <button type='submit'>Save</button>
                </form>
            </div>
            :
            null
    )
}

export default Information;