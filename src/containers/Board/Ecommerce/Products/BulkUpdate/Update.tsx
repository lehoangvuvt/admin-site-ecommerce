import { FC, useEffect, useRef, useState } from "react";
import FileDownload from 'js-file-download';
import validator from 'validator';
import {
    ProductBrandType,
} from '../../../../types';
import { formatter as currencyFormatter } from '../../../../../utils/currency.formatter';
import * as XLSX from 'xlsx';
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import { RootReducerType } from "../../../../reducer";
import { connect } from "react-redux";


type ProductType = {
    SID: string,
    SKU: string,
    PRODUCT_NAME: string,
    PRODUCT_GENDER: string,
    BRAND: string,
    THRESHOLD: number,
    PRICE: number,
    TAX: number,
}

const mapStateToProps = (state: RootReducerType) => {
    return {
        bulkUpdate: state.bulkUpdate,
    }
}

const Update: FC<ReturnType<typeof mapStateToProps>> = ({ bulkUpdate }) => {
    const { selectedProducts } = bulkUpdate;
    const [file, setFile] = useState<FileList | null>(null);
    const [totalPercentCompleted, setTotalPercentCompleted] = useState(0);
    const [importProductsCompleted, setImportProductsCompleted] = useState(false);
    const [isLoadingProductsImport, setIsLoadingProductsImport] = useState(false);
    const [products, setProducts] = useState<Array<ProductType>>([]);
    const [brands, setBrands] = useState<Array<ProductBrandType>>([]);
    const [errorDatas, setErrorDatas] = useState<Array<{ cell: string, error: string, table: string }>>([]);
    const [checked, setChecked] = useState(false);
    const [isChecking, setChecking] = useState(false);

    const readExcel = () => {
        if (file) {
            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file[0]);
                fileReader.onload = (e) => {
                    if (e.target) {
                        const bufferArray = e.target.result;
                        const wb = XLSX.read(bufferArray, { type: "buffer" });
                        const products = wb.SheetNames[0];
                        const wsProducts = wb.Sheets[products];
                        const data = XLSX.utils.sheet_to_json(wsProducts)
                        resolve(data);
                    }
                }
                fileReader.onerror = (error) => {
                    reject(error);
                }
            })
            promise.then((data: any) => {
                const products = data;
                setProducts(products);
            })
        }
    }

    const exportExcel = async () => {
        let products: Array<{
            SID: string,
            SKU: string,
            PRODUCT_NAME: string,
            PRODUCT_GENDER: string,
            BRAND: string,
            THRESHOLD: number,
            PRICE: number,
            TAX: number,
        }> = [];
        selectedProducts.forEach(product => {
            const { SID, SKU, PRODUCT_NAME, PRODUCT_GENDER, productPrices, productBrand, THRESHOLD } = product;
            const PRICE = productPrices.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime())[0].UNIT_PRICE;
            const TAX = productPrices.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime())[0].TAX;
            const BRAND = productBrand.NAME;
            products.push({ SID, SKU, PRODUCT_NAME, PRODUCT_GENDER, BRAND, THRESHOLD, PRICE, TAX });
        })
        const response = await axios({
            url: "http://localhost:5035/admin/export",
            method: "POST",
            data: products,
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
        setChecked(false);
        setChecking(true);
        let checkedProducts = false;
        let errorCells: Array<{ cell: string, error: string, table: string }> = [];
        for (let i = 0; i < products.length; i++) {
            const productGender = products[i].PRODUCT_GENDER;
            if (productGender !== 'Men' && productGender !== 'Women' && productGender !== 'Both') {
                const cell = `D${i + 1}`;
                errorCells.push({ cell, error: 'Incorrect product gender (only receive input: Men, Women, Both)', table: 'Products' });
            }
            if (brands.filter(brand => brand.NAME === products[i].BRAND).length === 0) {
                const cell = `E${i + 2}`;
                errorCells.push({ cell, error: 'Incorrect brand name', table: 'Products' });
            }
            const isThreshold = validator.isInt(products[i].THRESHOLD.toString());
            if (!isThreshold) {
                const cell = `F${i + 2}`;
                errorCells.push({ cell, error: 'Incorrect threshold format', table: 'Products' });
            }
            const isPrice = validator.isFloat(products[i].PRICE.toString());
            if (!isPrice) {
                const cell = `G${i + 2}`;
                errorCells.push({ cell, error: 'Incorrect price format', table: 'Products' });
            }
            if (i === products.length - 1) {
                checkedProducts = true;
            }
            const isTax = validator.isFloat(products[i].TAX.toString());
            if (!isTax) {
                const cell = `H${i + 2}`;
                errorCells.push({ cell, error: 'Incorrect tax format', table: 'Products' });
            }
            if (i === products.length - 1) {
                checkedProducts = true;
            }
        }
        if (checkedProducts) {
            if (errorCells.length > 0) {
                setErrorDatas(errorCells);
            }
            setChecking(false);
            setChecked(true);
        }
    }

    const updateData = async () => {
        setTotalPercentCompleted(0);
        setImportProductsCompleted(false);
        for (let i = 0; i < products.length; i++) {
            const updateProductResponse = await updateProduct(products[i]);
            if (i === products.length - 1 && updateProductResponse.isSuccess) {
                setIsLoadingProductsImport(false);
                setImportProductsCompleted(true);
            }
        }
    }

    const updateProduct = async (product: ProductType) => {
        const BRAND_SID = brands.filter(brand => brand.NAME === product.BRAND)[0].SID;
        const priceString = product.PRICE + "";
        const taxString = product.TAX + "";
        const UNIT_PRICE = parseFloat(priceString);
        const TAX = parseFloat(taxString);
        const body = {
            PRODUCT_NAME: product.PRODUCT_NAME,
            THRESHOLD: product.THRESHOLD,
            BRAND_SID,
            PRODUCT_GENDER: product.PRODUCT_GENDER,
            UNIT_PRICE,
            TAX,
        };

        const response = await axios({
            url: `http://localhost:5035/products/product-information/update/${product.SID}`,
            method: 'PUT',
            data: body,
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const taskPercentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                const percentagePerProduct = parseFloat((100 / products.length).toFixed(1));
                const totalCompleted = (percentagePerProduct / 100 * taskPercentCompleted);
                setTotalPercentCompleted(oldTotalPercentCompleted => oldTotalPercentCompleted + totalCompleted);
            }
        })
        const data = response.data;
        if (data.error) {
            console.log(data.error);
            return { isSuccess: false };
        } else {
            return { isSuccess: true };
        }
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

    useEffect(() => {
        getAllBrands();
    }, [])

    return (
        <div className="update-products-container">
            <div className="update-products-container__header">
                <p onClick={() => {
                    exportExcel();
                }}>Download Data File</p>
            </div>
            <div className="update-products-container__upload-file">
                <div className="update-products-container__upload-file__title">
                    <h1>Updated Data File</h1>
                </div>
                <div className="update-products-container__upload-file__body">
                    <p>Import Updated File</p>
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
                        <div className='update-products-container__errors-container'>
                            <p> <i style={{ color: '#C0392B' }} className="fas fa-exclamation-circle"></i>
                                &nbsp; Checked cells: {(7 * (products.length))},
                                Invalid cells: {errorDatas.length}</p>
                            {errorDatas.map(error =>
                                <p>Error at cell {error.cell}: {error.error}</p>
                            )}
                        </div>
                        :
                        <div className='update-products-container__errors-container'>
                            <p><i style={{ color: '#2980B9' }} className="fas fa-check-circle"></i> &nbsp;
                                Checked cells:  {(7 * (products.length))}, Invalid cells: {errorDatas.length}</p>
                        </div>
                    : null
            }

            {file
                && checked
                && errorDatas.length === 0 ?
                <div className='update-products-container__file-status-container'>
                    <div className='update-products-container__file-status-container__icon'>
                        <i className="fas fa-file"></i>
                    </div>
                    <div className='update-products-container__file-status-container__text'>
                        <div className='update-products-container__file-status-container__text__filename'>
                            <h1>{file ? file[0].name : 'abc.xlsx'}</h1>
                        </div>
                        <div className='update-products-container__file-status-container__text__status'>
                            {isLoadingProductsImport ? <h1>Updating Products...</h1> : null}
                            {importProductsCompleted ? <h1>Completed</h1> : null}
                        </div>
                    </div>
                    <div className='update-products-container__file-status-container__buttons'>
                        {!isLoadingProductsImport ?
                            <button
                                disabled={!checked}
                                onClick={() => {
                                    updateData();
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
                        className='update-products-container__file-status-container__loading-bar'>
                    </div>
                </div>
                : null
            }

            {
                products.length > 0
                    && checked
                    && errorDatas.length === 0 ?
                    <div className='update-products-container__products-table'>
                        <div className='update-products-container__products-table__headers'>
                            <div className='update-products-container__products-table__headers__header'>

                            </div>
                            <div className='update-products-container__products-table__headers__header'>
                                <p>SKU</p>
                            </div>
                            <div className='update-products-container__products-table__headers__header'>
                                <p>Name</p>
                            </div>
                            <div className='update-products-container__products-table__headers__header'>
                                <p>Gender</p>
                            </div>
                            <div className='update-products-container__products-table__headers__header'>
                                <p>Threshold</p>
                            </div>
                            <div className='update-products-container__products-table__headers__header'>
                                <p>Brand</p>
                            </div>
                            <div className='update-products-container__products-table__headers__header'>
                                <p>Price</p>
                            </div>
                            <div className='update-products-container__products-table__headers__header'>
                                <p>Tax</p>
                            </div>
                        </div>
                        {products.map((product, i: number) =>
                            <div className='update-products-container__products-table__row'>
                                <div className='update-products-container__products-table__row__column'>
                                    <p>{i + 1}</p>
                                </div>
                                <div className='update-products-container__products-table__row__column'>
                                    <p>{product.SKU}</p>
                                </div>
                                <div className='update-products-container__products-table__row__column'>
                                    <p>{product.PRODUCT_NAME}</p>
                                </div>
                                <div className='update-products-container__products-table__row__column'>
                                    <p>{product.PRODUCT_GENDER}</p>
                                </div>
                                <div className='update-products-container__products-table__row__column'>
                                    <p>{product.THRESHOLD}</p>
                                </div>
                                <div className='update-products-container__products-table__row__column'>
                                    <p>{product.BRAND}</p>
                                </div>
                                <div className='update-products-container__products-table__row__column'>
                                    <p>{currencyFormatter(product.PRICE)}</p>
                                </div>
                                <div className='update-products-container__products-table__row__column'>
                                    <p>{product.TAX}</p>
                                </div>
                            </div>
                        )}
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

export default connect(mapStateToProps)(Update);