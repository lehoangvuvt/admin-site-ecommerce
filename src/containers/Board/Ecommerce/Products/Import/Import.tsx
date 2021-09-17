import { useEffect, useRef, useState } from "react";
import FileDownload from 'js-file-download';
import validator from 'validator';
import {
    CategoryType,
    CreateAttributeGroupType,
    CreateAttributeValueType,
    CreateProductType,
    ProductAttributeGroupType,
    ProductAttributeType,
    ProductBrandType,
    ProductInformationType,
    ProductType
} from '../../../../types';
import { formatter as currencyFormatter } from '../../../../../utils/currency.formatter';
import * as XLSX from 'xlsx';
import axios from "axios";
import { CircularProgress } from "@material-ui/core";

type OptionType = {
    groupAttribute: {
        attribute: ProductAttributeType,
        value: any,
    },
    subAttribute: {
        attribute: ProductAttributeType,
        value: any,
    },
    IMG1: File,
    IMG2: File,
    IMG3: File,
    QTY: number,
}

type ImportedProductType = {
    PRODUCT_NAME: string,
    SKU: string,
    CATEGORY_NAME: string,
    BRAND_NAME: string,
    SHORT_DESCRIPTION: string,
    SHORT_DESCRIPTION_TEXT: string,
    LONG_DESCRIPTION: string,
    LONG_DESCRIPTION_TEXT: string,
    PRODUCT_GENDER: string,
    PRICE: number,
    TAX: number,
    options: Array<OptionType>,
}

type ImportedCategoryType = {
    CATEGORY_NAME: string,
    SHORT_DESCRIPTION: string,
    LONG_DESCRIPTION: string
}

type ImportedBrandType = {
    NAME: string
}

const Import = () => {
    const [file, setFile] = useState<FileList | null>(null);
    const [images, setImages] = useState<FileList | null>(null);
    const [totalPercentCompleted, setTotalPercentCompleted] = useState(0);
    const [importCategoriesCompleted, setImportCategoriesCompleted] = useState(false);
    const [importBrandsCompleted, setImportBrandsCompleted] = useState(false);
    const [importProductsCompleted, setImportProductsCompleted] = useState(false);
    const [isLoadingCategoriesImport, setIsLoadingCategoriesImport] = useState(false);
    const [isLoadingBrandsImport, setIsLoadingBrandsImport] = useState(false);
    const [isLoadingProductsImport, setIsLoadingProductsImport] = useState(false);
    const [products, setProducts] = useState<Array<Array<{ value: string }>>>([]);
    const [productsTableData, setProductsTableData] = useState<Array<ImportedProductType>>([]);
    const [importedCategories, setImportedCategories] = useState<Array<ImportedCategoryType>>([]);
    const [importedBrands, setImportedBrands] = useState<Array<ImportedBrandType>>([]);
    const [categories, setCategories] = useState<Array<CategoryType>>([]);
    const [brands, setBrands] = useState<Array<ProductBrandType>>([]);
    const [attributes, setAttributes] = useState<Array<ProductAttributeType>>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [openPicturesModal, setOpenPicturesModal] = useState(false);
    const [errorDatas, setErrorDatas] = useState<Array<{ cell: string, error: string, table: string }>>([]);
    const [checked, setChecked] = useState(false);
    const [isChecking, setChecking] = useState(false);
    const [tableOpt, setTableOpt] = useState(1);
    const folderInput = useRef(null);

    const readExcel = () => {
        if (file) {
            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file[0]);
                fileReader.onload = (e) => {
                    if (e.target) {
                        const bufferArray = e.target.result;
                        const wb = XLSX.read(bufferArray, { type: "buffer" });
                        const categories = wb.SheetNames[0];
                        const brands = wb.SheetNames[1];
                        const products = wb.SheetNames[2];
                        const wsBrands = wb.Sheets[brands];
                        const wsCategories = wb.Sheets[categories];
                        const wsProducts = wb.Sheets[products];
                        const data = [
                            XLSX.utils.sheet_to_json(wsCategories),
                            XLSX.utils.sheet_to_json(wsBrands),
                            XLSX.utils.sheet_to_json(wsProducts)
                        ];
                        resolve(data);
                    }
                }
                fileReader.onerror = (error) => {
                    reject(error);
                }
            })
            promise.then((data: any) => {
                const categories = data[0];
                const brands = data[1];
                setImportedCategories(categories);
                setImportedBrands(brands);
                const products = data[2];
                let allRows: Array<Array<{ value: string }>> = [];
                const headers = Object.getOwnPropertyNames(products[0]);
                let headersRow: Array<{ value: string }> = [];
                headers.map(header => {
                    headersRow.push({ value: header });
                })
                allRows.push(headersRow);
                products.map((data: any) => {
                    let row: Array<{ value: string }> = [];
                    headers.map(header => {
                        if (data[header] && data[header].toString().trim() !== "") {
                            row.push({ value: data[header] });
                        } else {
                            row.push({ value: ' ' });
                        }
                    })
                    allRows.push(row);
                })
                setProducts(allRows);
            })
        }
    }

    const exportExcel = async () => {
        const categories = [
            {
                CATEGORY_NAME: 'Shoes',
                SHORT_DESCRIPTION: 'This is short description',
                LONG_DESCRIPTION: 'This is long description'
            }
        ];
        const brands = [
            {
                NAME: 'ADIDAS'
            }
        ];
        const products = [
            {
                ID: 1,
                PARENT_ID: ' ',
                PRODUCT_NAME: 'Name 1',
                SKU: 'SKU1',
                CATEGORY: 'Shoes',
                BRAND: 'Uniqlo',
                PRODUCT_GENDER: 'Men',
                SHORT_DESCRIPTION: '<h1>This is long description</h1>',
                LONG_DESCRIPTION: '<p>This is long description<p>',
                SHORT_DESCRIPTION_TEXT: 'This is long description',
                LONG_DESCRIPTION_TEXT: 'This is long description',
                'PRICE (VNĐ)': 500000,
                'TAX (%)': 2,
                ATTRIBUTE1_NAME: ' ',
                ATTRIBUTE1_VALUE: ' ',
                ATTRIBUTE2_NAME: ' ',
                ATTRIBUTE2_VALUE: ' ',
                IMG1_NAME: ' ',
                IMG2_NAME: ' ',
                IMG3_NAME: ' ',
            },
            {
                ID: ' ',
                PARENT_ID: '1',
                PRODUCT_NAME: ' ',
                SKU: ' ',
                CATEGORY: ' ',
                BRAND: ' ',
                PRODUCT_GENDER: ' ',
                SHORT_DESCRIPTION: ' ',
                LONG_DESCRIPTION: ' ',
                SHORT_DESCRIPTION_TEXT: ' ',
                LONG_DESCRIPTION_TEXT: ' ',
                'PRICE (VNĐ)': ' ',
                'TAX (%)': ' ',
                ATTRIBUTE1_NAME: 'color',
                ATTRIBUTE1_VALUE: 'Black',
                ATTRIBUTE2_NAME: 'size_text',
                ATTRIBUTE2_VALUE: 'XXL',
                IMG1_NAME: '1.png',
                IMG2_NAME: '2.png',
                IMG3_NAME: '3.png',
                QTY: 5,
            },
        ];
        const body = {
            categories,
            brands,
            products
        };
        const response = await axios({
            url: "http://localhost:5035/admin/export-template",
            method: "POST",
            data: body,
            responseType: 'arraybuffer',
            withCredentials: true,
        });
        FileDownload(response.data, `template.xlsx`);
    }

    useEffect(() => {
        if (file) {
            readExcel();
        }
    }, [file])

    const checkSKU = async (SKU: string) => {
        let isValid = false;
        const response = await axios({
            url: `http://localhost:5035/products/import-check/sku/${SKU}`,
            method: 'GET',
            withCredentials: true
        });
        const data = response.data;
        isValid = data.isValid;
        return isValid;
    }

    const checkCategory = async (CATEGORY_NAME: string) => {
        let isValid = false;
        const response = await axios({
            url: `http://localhost:5035/products/import-check/category/${CATEGORY_NAME}`,
            method: 'GET',
            withCredentials: true
        });
        const data = response.data;
        isValid = data.isValid;
        return isValid;
    }

    const checkBrand = async (BRAND_NAME: string) => {
        let isValid = false;
        const response = await axios({
            url: `http://localhost:5035/products/import-check/brand/${BRAND_NAME}`,
            method: 'GET',
            withCredentials: true
        });
        const data = response.data;
        isValid = data.isValid;
        return isValid;
    }

    const check = async () => {
        setErrorDatas([]);
        setProductsTableData([]);
        setTotalProducts(0);
        setChecked(false);
        setChecking(true);
        let checkedCategories = false;
        let checkedBrands = false;
        let checkedProducts = false;
        let errorCells: Array<{ cell: string, error: string, table: string }> = [];
        let datas: Map<string, ImportedProductType> = new Map();
        for (let z = 0; z < importedCategories.length; z++) {
            const categoryName = importedCategories[z].CATEGORY_NAME;
            const isCategoryValid = await checkCategory(categoryName);
            if (!isCategoryValid) {
                const cell = `A${z + 1}`;
                errorCells.push({ cell, error: `Category with name '${categoryName}' is already existed`, table: 'Categories' });
            }
            if (z === importedCategories.length - 1) {
                checkedCategories = true;
            }
        }
        for (let n = 0; n < importedBrands.length; n++) {
            const brandName = importedBrands[n].NAME;
            const isBrandValid = await checkBrand(brandName);
            if (!isBrandValid) {
                const cell = `A${n + 1}`;
                errorCells.push({ cell, error: `Brand with name '${brandName}' is already existed`, table: 'Brands' });
            }
            if (n === importedBrands.length - 1) {
                checkedBrands = true;
            }
        }
        for (let i = 1; i < products.length; i++) {
            if (products[i][1].value) {
                if (products[i][1].value.toString().trim() !== "") {
                    const ID = products[i][1].value;
                    const SKU = products[i][4].value;
                    const isSKUValid = await checkSKU(SKU);
                    if (!isSKUValid) {
                        const cell = `D${i + 1}`;
                        errorCells.push({ cell, error: `Product with SKU '${SKU}' is already existed`, table: 'Products' });
                    }
                    const categoryName = products[i][5].value;
                    const brandName = products[i][6].value;
                    let CATEGORY_NAME = '';
                    if (categories.filter(category => category.CATEGORY_NAME === categoryName).length > 0
                        || importedCategories.filter(category => category.CATEGORY_NAME === categoryName).length > 0) {
                        if (categories.filter(category => category.CATEGORY_NAME === categoryName).length > 0) {
                            CATEGORY_NAME = categories.filter(category => category.CATEGORY_NAME === categoryName)[0].CATEGORY_NAME;
                        } else {
                            CATEGORY_NAME = importedCategories.filter(category => category.CATEGORY_NAME === categoryName)[0].CATEGORY_NAME;
                        }
                    } else {
                        const cell = `E${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect category name', table: 'Products' });
                    }
                    let BRAND_NAME = '';
                    if (brands.filter(brand => brand.NAME === brandName).length > 0 ||
                        importedBrands.filter(brand => brand.NAME === brandName).length > 0
                    ) {
                        if (brands.filter(brand => brand.NAME === brandName).length > 0) {
                            BRAND_NAME = brands.filter(brand => brand.NAME === brandName)[0].NAME;
                        } else {
                            BRAND_NAME = importedBrands.filter(brand => brand.NAME === brandName)[0].NAME;
                        }
                    } else {
                        const cell = `F${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect brand name', table: 'Products' });
                    }
                    if (products[i][7].value !== 'Men' && products[i][7].value !== 'Women' && products[i][7].value !== 'Both') {
                        const cell = `G${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect product gender (only receive input: Men, Women, Both)', table: 'Products' });
                    }
                    let PRICE = 0;
                    const isPrice = validator.isFloat(products[i][12].value.toString());
                    if (!isPrice) {
                        const cell = `L${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect price format', table: 'Products' });
                    } else {
                        PRICE = parseFloat(products[i][12].value);
                    }
                    let TAX = 0;
                    const isTax = validator.isFloat(products[i][13].value.toString());
                    if (!isTax) {
                        const cell = `M${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect tax format', table: 'Products' });
                    } else {
                        TAX = parseFloat(products[i][13].value);
                    }
                    datas.set(ID, {
                        PRODUCT_NAME: products[i][3].value,
                        SKU: products[i][4].value,
                        CATEGORY_NAME,
                        BRAND_NAME,
                        PRODUCT_GENDER: products[i][7].value,
                        SHORT_DESCRIPTION: products[i][8].value,
                        LONG_DESCRIPTION: products[i][9].value,
                        SHORT_DESCRIPTION_TEXT: products[i][10].value,
                        LONG_DESCRIPTION_TEXT: products[i][11].value,
                        PRICE,
                        TAX,
                        options: [],
                    });
                } else {
                    const PARENT_ID = products[i][2].value;
                    const groupAttributeName = products[i][14].value;
                    let groupAttribute: ProductAttributeType | null = null;
                    if (attributes.filter(attribute => attribute.ATTRIBUTE_NAME === groupAttributeName).length > 0) {
                        groupAttribute = attributes.filter(attribute => attribute.ATTRIBUTE_NAME === groupAttributeName)[0];
                    } else {
                        const cell = `N${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect ATTRIBUTE1_NAME', table: 'Products' });
                    }
                    const groupAttributeValue = products[i][15].value;
                    const subAttributeName = products[i][16].value;
                    let subAttribute: ProductAttributeType | null = null;
                    if (attributes.filter(attribute => attribute.ATTRIBUTE_NAME === subAttributeName).length > 0) {
                        subAttribute = attributes.filter(attribute => attribute.ATTRIBUTE_NAME === subAttributeName)[0];
                    } else {
                        const cell = `P${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect ATTRIBUTE2_NAME', table: 'Products' });
                    }
                    const subAttributeValue = products[i][17].value;
                    const IMG1_NAME = products[i][18].value;
                    const IMG2_NAME = products[i][19].value;
                    const IMG3_NAME = products[i][20].value;
                    let QTY = 0;
                    const isQTY = validator.isInt(products[i][21].value.toString());
                    if (!isQTY) {
                        const cell = `U${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect QTY format', table: 'Products' });
                    } else {
                        QTY = parseFloat(products[i][20].value);
                    }
                    QTY = parseInt(products[i][21].value);
                    let IMG1: any = null;
                    let IMG2: any = null;
                    let IMG3: any = null
                    if (images) {
                        for (let i = 0; i < images.length; i++) {
                            if (images[i].name === IMG1_NAME) {
                                IMG1 = images[i];
                            }
                            if (images[i].name === IMG2_NAME) {
                                IMG2 = images[i];
                            }
                            if (images[i].name === IMG3_NAME) {
                                IMG3 = images[i];
                            }
                        }
                    }
                    if (!IMG1) {
                        const cell = `R${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect IMG1_NAME', table: 'Products' });
                    }
                    if (!IMG2) {
                        const cell = `S${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect IMG2_NAME', table: 'Products' });
                    }
                    if (!IMG3) {
                        const cell = `T${i + 1}`;
                        errorCells.push({ cell, error: 'Incorrect IMG3_NAME', table: 'Products' });
                    }
                    const parentProductInfo = datas.get(PARENT_ID);
                    if (parentProductInfo && groupAttribute && subAttribute) {
                        parentProductInfo.options.push({
                            groupAttribute: {
                                attribute: groupAttribute,
                                value: groupAttributeValue
                            },
                            subAttribute: {
                                attribute: subAttribute,
                                value: subAttributeValue,
                            },
                            IMG1,
                            IMG2,
                            IMG3,
                            QTY
                        })
                    }
                }
            }
            if (i === products.length - 1) {
                checkedProducts = true;
            }
        }
        if (checkedCategories && checkedBrands && checkedProducts) {
            if (errorCells.length === 0) {
                datas.forEach((value, key) => {
                    setProductsTableData(oldTableData => [...oldTableData, value]);
                    setTotalProducts(oldTotalProducts => oldTotalProducts + value.options.length);
                })
            } else {
                setProductsTableData([]);
                setErrorDatas(errorCells);
            }
            setChecking(false);
            setChecked(true);
        }
    }

    const importCategory = async (category: ImportedCategoryType) => {
        const body = {
            CATEGORY_NAME: category.CATEGORY_NAME,
            SHORT_DESCRIPTION: category.LONG_DESCRIPTION,
            LONG_DESCRIPTION: category.LONG_DESCRIPTION
        };
        const response = await axios({
            url: `http://localhost:5035/categories/create`,
            data: body,
            method: 'POST',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const taskPercentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                const percentagePerCategory = parseFloat((25 / importedCategories.length).toFixed(1));
                const totalCompleted = (percentagePerCategory / 100 * taskPercentCompleted);
                setTotalPercentCompleted(oldTotalPercentCompleted => oldTotalPercentCompleted + totalCompleted);
            }
        })
        const data = response.data;
        return { category: data.category };
    }

    const importBrand = async (brand: ImportedBrandType) => {
        const body = {
            NAME: brand.NAME
        };
        const response = await axios({
            url: `http://localhost:5035/products/brand/create`,
            data: body,
            method: 'POST',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const taskPercentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                const percentagePerBrand = parseFloat((25 / importedBrands.length).toFixed(1));
                const totalCompleted = (percentagePerBrand / 100 * taskPercentCompleted);
                setTotalPercentCompleted(oldTotalPercentCompleted => oldTotalPercentCompleted + totalCompleted);
            }
        })
        const data = response.data;
        return { productBrand: data.productBrand };
    }

    const importData = async () => {
        setTotalPercentCompleted(0);
        setImportCategoriesCompleted(false);
        setImportProductsCompleted(false);
        setImportCategoriesCompleted(false);
        setIsLoadingCategoriesImport(true);
        for (let i = 0; i < importedCategories.length; i++) {
            const importCategoryResponse = await importCategory(importedCategories[i]);
            if (i === importedCategories.length - 1 && importCategoryResponse.category) {
                setIsLoadingCategoriesImport(false);
                setImportCategoriesCompleted(true);
                setIsLoadingBrandsImport(true);
                for (let n = 0; n < importedBrands.length; n++) {
                    const importBrandResponse = await importBrand(importedBrands[n]);
                    if (n === importedBrands.length - 1 && importBrandResponse.productBrand) {
                        setImportBrandsCompleted(true);
                        setIsLoadingBrandsImport(false);
                        setIsLoadingProductsImport(true);
                        for (let y = 0; y < productsTableData.length; y++) {
                            const importProductResponse = await importProduct(productsTableData[y]);
                            if (y === productsTableData.length - 1 && importProductResponse.isSuccess) {
                                setIsLoadingProductsImport(false);
                                setImportProductsCompleted(true);
                            }
                        }
                    }
                }
            }
        }
    }

    const importProduct = async (importProduct: ImportedProductType) => {
        let productInformation: ProductInformationType;
        let isSuccess = false;
        const createProductInfoRes = await createProductInfo(importProduct);
        if (createProductInfoRes && createProductInfoRes.productInformation) {
            productInformation = createProductInfoRes.productInformation;
            const addCategoryForProductRes = await addCategoryForProduct(productInformation.SID, importProduct.CATEGORY_NAME);
            if (!addCategoryForProductRes.failed) {
                for (let i = 0; i < importProduct.options.length; i++) {
                    const productInformation = createProductInfoRes.productInformation;
                    const option = importProduct.options[i];
                    const createProductRes = await createProduct(option, productInformation);
                    if (createProductRes && createProductRes.product) {
                        const product = createProductRes.product;
                        const IMG1 = option.IMG1;
                        const IMG2 = option.IMG2;
                        const IMG3 = option.IMG3;
                        const addImagesRes = await addImages(product.SID, IMG1, IMG2, IMG3);
                        if (addImagesRes) {
                            const createAttributeGroupRes = await createAttributeGroup(productInformation, option.groupAttribute);
                            if (createAttributeGroupRes && createAttributeGroupRes.newAttributeGroup) {
                                const attributeGroupId = createAttributeGroupRes.newAttributeGroup.ID;
                                const createAttributeValueRes = await createAttributeValue(attributeGroupId, product.SID, option.subAttribute);
                                if (createAttributeValueRes && createAttributeValueRes.newAttributeValue) {
                                    isSuccess = true;
                                }
                            }
                        }
                    }
                };
            }
        }
        return { isSuccess };
    }

    const createProductInfo = async (value: ImportedProductType) => {
        const BRAND_NAME = value.BRAND_NAME;
        const getBrandSIDResponse = await axios({
            url: `http://localhost:5035/products/brand/${BRAND_NAME}`,
            method: 'GET',
            withCredentials: true,
        });
        const getBrandSIDResponseData = getBrandSIDResponse.data;
        const BRAND_SID = getBrandSIDResponseData.BRAND_SID;
        const body = {
            DISCOUNT: 0,
            SKU: value.SKU,
            LONG_DESCRIPTION: value.LONG_DESCRIPTION,
            LONG_DESCRIPTION_TEXT: value.LONG_DESCRIPTION_TEXT,
            PRODUCT_GENDER: value.PRODUCT_GENDER,
            SHORT_DESCRIPTION: value.SHORT_DESCRIPTION,
            SHORT_DESCRIPTION_TEXT: value.SHORT_DESCRIPTION_TEXT,
            PRODUCT_NAME: value.PRODUCT_NAME,
            SID_BRAND: BRAND_SID,
            TAX: value.TAX,
            UNIT_PRICE: value.PRICE
        }
        const response = await axios({
            url: `http://localhost:5035/products/product-information/create`,
            method: 'POST',
            data: body,
            withCredentials: true,
        });
        const data = response.data;
        let productInformation: ProductInformationType;
        if (data.error) return { error: data.error };
        productInformation = data.productInformation;
        return {
            productInformation,
        }
    }

    const addCategoryForProduct = async (SID_PRODUCT: string, CATEGORY_NAME: string) => {
        const getCategorySIDResponse = await axios({
            url: `http://localhost:5035/categories/category/${CATEGORY_NAME}`,
            method: 'GET',
            withCredentials: true,
        });
        const getCategorySIDResponseData = getCategorySIDResponse.data;
        const CATEGORY_SID = getCategorySIDResponseData.CATEGORY_SID;
        const body = {
            CATEGORY_ID_ARRAY: [CATEGORY_SID],
            SID_PRODUCT
        }
        const response = await axios({
            url: `http://localhost:5035/products/add-categories`,
            method: 'POST',
            data: body,
            withCredentials: true,
        });
        const data = response.data;
        if (data.success.length === 0) return { failed: data.failed };
        return {
            success: data.success,
        }
    }


    const createProduct = async (option: OptionType, productInformation: ProductInformationType) => {
        let createProductInfo: CreateProductType;
        createProductInfo = {
            QTY: option.QTY,
            SID_PRODUCT_INFORMATION: productInformation.SID
        };

        const response = await axios({
            url: `http://localhost:5035/products/product/create`,
            method: 'POST',
            data: createProductInfo,
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const taskPercentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                calculateProductsCompleted(taskPercentCompleted);
            }
        })
        let product: ProductType;
        const data = response.data;
        if (data.error) return { error: data.error };
        product = data.product;
        return { product };
    }

    const addImages = async (PRODUCT_SID: string, IMG1: File, IMG2: File, IMG3: File) => {
        let isSuccess = true;
        const file1 = IMG1;
        const file2 = IMG2;
        const file3 = IMG3;
        let data = new FormData();
        data.append('PRODUCT_SID', PRODUCT_SID);
        data.append('files', file1);
        data.append('files', file2);
        data.append('files', file3);
        const response = await axios.post('http://localhost:5035/products/add-images', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const taskPercentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                calculateProductsCompleted(taskPercentCompleted);
            }
        })
        const createImgsData = response.data;
        return isSuccess;
    }

    const createAttributeGroup = async (productInformation: ProductInformationType, groupAttribute: { attribute: ProductAttributeType, value: any }) => {
        let body: CreateAttributeGroupType;
        const groupAttributeId = groupAttribute.attribute.ID;
        const groupValueType = groupAttribute.attribute.VALUE_TYPE;
        if (groupValueType === 'DECIMAL') {
            body = {
                GROUP_ATTRIBUTE_ID: groupAttributeId,
                PRODUCT_INFORMATION_SID: productInformation.SID,
                GROUP_VALUE_DECIMAL: parseFloat(groupAttribute.value)
            }
        } else if (groupValueType === 'INT') {
            body = {
                GROUP_ATTRIBUTE_ID: groupAttributeId,
                PRODUCT_INFORMATION_SID: productInformation.SID,
                GROUP_VALUE_INT: parseInt(groupAttribute.value)
            }
        } else {
            body = {
                GROUP_ATTRIBUTE_ID: groupAttributeId,
                PRODUCT_INFORMATION_SID: productInformation.SID,
                GROUP_VALUE_VARCHAR: groupAttribute.value
            }
        }
        const response = await axios({
            url: `http://localhost:5035/products/attribute-group/create`,
            method: 'POST',
            data: body,
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const taskPercentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                calculateProductsCompleted(taskPercentCompleted);
            }
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

    const createAttributeValue = async (GROUP_ID: number, SID_PRODUCT: string, subAttribute: { attribute: ProductAttributeType, value: any }) => {
        let body: CreateAttributeValueType;
        const attributeId = subAttribute.attribute.ID;
        const attributeValueType = subAttribute.attribute.VALUE_TYPE;
        if (attributeValueType === 'DECIMAL') {
            body = {
                SID_PRODUCT,
                PRODUCT_ATTRIBUTE_ID: attributeId,
                PRODUCT_ATTRIBUTE_GROUP_ID: GROUP_ID,
                VALUE_DECIMAL: parseFloat(subAttribute.value)
            }
        } else if (attributeValueType === 'INT') {
            body = {
                SID_PRODUCT,
                PRODUCT_ATTRIBUTE_ID: attributeId,
                PRODUCT_ATTRIBUTE_GROUP_ID: GROUP_ID,
                VALUE_INT: parseInt(subAttribute.value)
            }
        } else {
            body = {
                SID_PRODUCT,
                PRODUCT_ATTRIBUTE_ID: attributeId,
                PRODUCT_ATTRIBUTE_GROUP_ID: GROUP_ID,
                VALUE_VARCHAR: subAttribute.value
            }
        }
        const response = await axios({
            url: `http://localhost:5035/products/attribute-value/create`,
            method: 'POST',
            data: body,
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const taskPercentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                calculateProductsCompleted(taskPercentCompleted);
            }
        })
        let newAttributeValue: ProductAttributeType;
        const data = response.data;
        if (data.error) return { error: data.error };
        newAttributeValue = data.newAttributeValue;
        return { newAttributeValue };
    }

    const calculateProductsCompleted = (taskPercentCompleted: number) => {
        const percentagePerTask = parseFloat((50 / totalProducts / 4).toFixed(1));
        const totalCompleted = (percentagePerTask / 100 * taskPercentCompleted);
        setTotalPercentCompleted(oldTotalPercentCompleted => oldTotalPercentCompleted + totalCompleted);
    }

    const getAllBrands = async () => {
        const response = await axios({
            url: 'http://localhost:5035/products/brands',
            method: 'GET',
            withCredentials: true,
        });
        const data = response.data;
        setBrands(data.brands);
    }

    const getAllCategories = async () => {
        const response = await axios({
            url: 'http://localhost:5035/categories',
            method: 'GET',
            withCredentials: true,
        });
        const data = response.data;
        setCategories(data.categories);
    }

    const getAllAttributes = async () => {
        const response = await axios({
            url: 'http://localhost:5035/products/attributes',
            method: 'GET',
            withCredentials: true,
        });
        const data = response.data;
        setAttributes(data.attributes);
    }

    useEffect(() => {
        getAllBrands();
        getAllCategories();
        getAllAttributes();
    }, [])

    const deleteAllProducts = async () => {
        await axios({
            url: 'http://localhost:5035/products/product-information/all',
            method: 'DELETE',
            withCredentials: true,
        })
    }

    return (
        <div className="import-products-container">
            <div className="import-products-container__header">
                <p onClick={() => {
                    exportExcel();
                }}>Download Template File</p>
            </div>
            <div className="import-products-container__upload-file">
                <div className="import-products-container__upload-file__title">
                    <h1>File to Import</h1>
                </div>
                <div className="import-products-container__upload-file__body">
                    <p>Select File to Import</p>
                    <input
                        style={{ display: 'none' }}
                        id='file-upload'
                        onChange={(e) => {
                            if (e.target.files) {
                                setFile(e.target.files);
                            }
                        }}
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    <button
                        onClick={() => {
                            document.getElementById('file-upload')?.click();
                        }}
                    >Browse...</button>
                    <a>{file ? file[0].name : 'No file selected'}</a>
                </div>
                <div className="import-products-container__upload-file__body">
                    <p>Choose pictures folder</p>
                    <input
                        style={{ display: 'none' }}
                        id='pictures-upload'
                        type="file"
                        directory=""
                        onChange={(e) => {
                            setImages(e.target.files);
                        }}
                        webkitdirectory=""
                        ref={folderInput}
                    />
                    <button
                        onClick={() => {
                            document.getElementById('pictures-upload')?.click();
                        }}
                    >Browse...</button>
                    <a
                        onClick={() => {
                            setOpenPicturesModal(true);
                        }}
                    >{images ? images.length : 0} picture(s) found</a>
                </div>
            </div>
            <button
                className={!isChecking ? 'check-data-btn' : 'check-data-btn check-data-btn--disabled'}
                onClick={() => {
                    if (file) {
                        check()
                    } else {
                        alert('Please choose a file to import');
                    }
                }}
                disabled={isChecking}
            ><h1>{isChecking ? 'Checking data...' : 'Check data'}</h1>{isChecking ? <CircularProgress color="secondary" /> : null}</button>
            {
                checked ?
                    errorDatas.length > 0 ?
                        <div className='import-products-container__errors-container'>
                            <p> <i style={{ color: '#C0392B' }} className="fas fa-exclamation-circle"></i>
                                &nbsp; Checked cells: {(21 * (products.length - 1))
                                    + (importedBrands.length)
                                    + (3 * importedCategories.length)},
                                Invalid cells: {errorDatas.length}</p>
                            {errorDatas.map(error =>
                                <p>Error at cell {error.cell} of table '{error.table}': {error.error}</p>
                            )}
                        </div>
                        :
                        <div className='import-products-container__errors-container'>
                            <p><i style={{ color: '#2980B9' }} className="fas fa-check-circle"></i> &nbsp;
                                Checked cells:  {(21 * (products.length - 1))
                                    + (importedBrands.length)
                                    + (3 * importedCategories.length)}, Invalid cells: {errorDatas.length}</p>
                        </div>
                    : null
            }

            {file
                && checked
                && errorDatas.length === 0 ?
                <div className='import-products-container__file-status-container'>
                    <div className='import-products-container__file-status-container__icon'>
                        <i className="fas fa-file"></i>
                    </div>
                    <div className='import-products-container__file-status-container__text'>
                        <div className='import-products-container__file-status-container__text__filename'>
                            <h1>{file ? file[0].name : 'abc.xlsx'}</h1>
                        </div>
                        <div className='import-products-container__file-status-container__text__status'>
                            {isLoadingCategoriesImport ? <h1>Importing Categories...</h1> : null}
                            {isLoadingBrandsImport ? <h1>Importing Brands...</h1> : null}
                            {isLoadingProductsImport ? <h1>Importing Products...</h1> : null}
                            {importProductsCompleted ? <h1>Completed</h1> : null}
                        </div>
                    </div>
                    <div className='import-products-container__file-status-container__buttons'>
                        {!isLoadingCategoriesImport &&
                            !isLoadingBrandsImport &&
                            !isLoadingProductsImport ?
                            <button
                                disabled={!checked}
                                onClick={() => {
                                    importData();
                                }}
                            >Import File</button>
                            :
                            <button
                                disabled
                                style={{
                                    cursor: 'not-allowed',
                                    background: 'rgba(0,0,0,0.1)',
                                    color: 'rgba(0,0,0,0.3)'
                                }}
                            >Importing File</button>
                        }
                    </div>
                    <div
                        style={{ width: `${Math.ceil(totalPercentCompleted)}%` }}
                        className='import-products-container__file-status-container__loading-bar'>
                    </div>
                </div>
                : null
            }

            {
                checked
                    && errorDatas.length === 0 ?
                    <div className='import-products-container__table-selector'>
                        <div
                            onClick={() => {
                                setTableOpt(1);
                            }}
                            className={
                                tableOpt === 1 ?
                                    'import-products-container__table-selector__option import-products-container__table-selector__option--active'
                                    :
                                    'import-products-container__table-selector__option'
                            }>
                            <p>Categories <span className='total-rows'>{importedCategories.length}</span></p>
                        </div>
                        <div
                            onClick={() => {
                                setTableOpt(2);
                            }}
                            className={
                                tableOpt === 2 ?
                                    'import-products-container__table-selector__option import-products-container__table-selector__option--active'
                                    :
                                    'import-products-container__table-selector__option'
                            }>
                            <p>Brands <span className='total-rows'>{importedBrands.length}</span></p>
                        </div>
                        <div
                            onClick={() => {
                                setTableOpt(3);
                            }}
                            className={
                                tableOpt === 3 ?
                                    'import-products-container__table-selector__option import-products-container__table-selector__option--active'
                                    :
                                    'import-products-container__table-selector__option'
                            }>
                            <p>Products <span className='total-rows'>{productsTableData.length}</span></p>
                        </div>
                    </div>
                    : null
            }

            {
                importedCategories.length > 0
                    && tableOpt === 1
                    && checked
                    && errorDatas.length === 0 ?
                    <div className='import-products-container__category-table'>
                        <div className='import-products-container__category-table__headers'>
                            <div className='import-products-container__category-table__headers__header'>

                            </div>
                            <div className='import-products-container__category-table__headers__header'>
                                <p>Name</p>
                            </div>
                            <div className='import-products-container__category-table__headers__header'>
                                <p>Long Description</p>
                            </div>
                            <div className='import-products-container__category-table__headers__header'>
                                <p>Short Description</p>
                            </div>
                        </div>
                        {importedCategories.map((category, i: number) =>
                            <div className='import-products-container__category-table__row'>
                                <div className='import-products-container__category-table__row__column'>
                                    <p>{i + 1}</p>
                                </div>
                                <div className='import-products-container__category-table__row__column'>
                                    <p>{category.CATEGORY_NAME}</p>
                                </div>
                                <div className='import-products-container__category-table__row__column'>
                                    <p>{category.LONG_DESCRIPTION}</p>
                                </div>
                                <div className='import-products-container__category-table__row__column'>
                                    <p>{category.SHORT_DESCRIPTION}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    : null
            }

            {
                importedBrands.length > 0
                    && tableOpt === 2
                    && checked && errorDatas.length === 0 ?
                    <div className='import-products-container__category-table'>
                        <div className='import-products-container__category-table__headers'>
                            <div className='import-products-container__category-table__headers__header'>

                            </div>
                            <div className='import-products-container__category-table__headers__header'>
                                <p>Name</p>
                            </div>
                        </div>
                        {importedBrands.map((brand, i: number) =>
                            <div className='import-products-container__category-table__row'>
                                <div className='import-products-container__category-table__row__column'>
                                    <p>{i + 1}</p>
                                </div>
                                <div className='import-products-container__category-table__row__column'>
                                    <p>{brand.NAME}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    : null
            }

            {
                productsTableData.length > 0
                    && tableOpt === 3
                    && errorDatas.length === 0 ?
                    <div className='import-products-container__products-table'>
                        <div className='import-products-container__products-table__headers'>
                            <div className='import-products-container__products-table__headers__header'>

                            </div>
                            <div className='import-products-container__products-table__headers__header'>
                                <p>Name</p>
                            </div>
                            <div className='import-products-container__products-table__headers__header'>
                                <p>SKU</p>
                            </div>
                            <div className='import-products-container__products-table__headers__header'>
                                <p>Brand</p>
                            </div>
                            <div className='import-products-container__products-table__headers__header'>
                                <p>Category</p>
                            </div>
                            <div className='import-products-container__products-table__headers__header'>
                                <p>Long Description</p>
                            </div>
                            <div className='import-products-container__products-table__headers__header'>
                                <p>Short Description</p>
                            </div>
                            <div className='import-products-container__products-table__headers__header'>
                                <p>Price</p>
                            </div>
                            <div className='import-products-container__products-table__headers__header'>
                                <p>Tax</p>
                            </div>
                            <div className='import-products-container__products-table__headers__header'>
                                <p>Options</p>
                            </div>
                        </div>
                        {productsTableData.map((tData, i: number) =>
                            <div className='import-products-container__products-table__row'>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{i + 1}</p>
                                </div>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{tData.PRODUCT_NAME}</p>
                                </div>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{tData.SKU}</p>
                                </div>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{tData.BRAND_NAME}</p>
                                </div>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{tData.CATEGORY_NAME}</p>
                                </div>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{tData.LONG_DESCRIPTION_TEXT}</p>
                                </div>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{tData.SHORT_DESCRIPTION_TEXT}</p>
                                </div>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{currencyFormatter(tData.PRICE)}</p>
                                </div>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{tData.TAX}</p>
                                </div>
                                <div className='import-products-container__products-table__row__column'>
                                    <p>{tData.options.length}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    : null
            }
            {
                openPicturesModal ?
                    <div
                        onClick={() => {
                            setOpenPicturesModal(false);
                        }}
                        className='import-products-container__pictures-modal'>
                        <div className='import-products-container__pictures-modal__pictures-container'>
                            {Array.prototype.map.call(images, (file) =>
                                <div className='import-products-container__pictures-modal__pictures-container__picture'>
                                    <div className='import-products-container__pictures-modal__pictures-container__picture__image'>
                                        <img src={URL.createObjectURL(file)} />
                                    </div>
                                    <div className='import-products-container__pictures-modal__pictures-container__picture__name'>
                                        <h1>File name: {file.name}</h1>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    : null
            }
        </div >
    )
}

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        directory?: string;
        webkitdirectory?: string;
    }
}

export default Import;