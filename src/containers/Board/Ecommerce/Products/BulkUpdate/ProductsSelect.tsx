import { DataGrid, GridColDef, GridRowId, GridValueGetterParams } from "@material-ui/data-grid";
import axios from "axios";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { CategoryConnectionsType, ProductAttributeGroupType, ProductBrandType, ProductInformationType, ProductPriceType, ProductReviewType } from "../../../../types";
import { formatter as currencyFormatter } from '../../../../../utils/currency.formatter';
import '../../../../../table.scss';
import LoadingBar from "../../../../../components/LoadingBar";
import { useRouter } from "../../../../../hooks/router";
import { actions } from "./actions";
import { connect } from "react-redux";

export type ProductType = {
    id: number,
    SID: string,
    SID_BRAND: string,
    CREATED_DATETIME: Date,
    MODIFIED_DATETIME: Date,
    PRODUCT_NAME: string,
    LONG_DESCRIPTION: string,
    SHORT_DESCRIPTION: string,
    THRESHOLD: number,
    CAN_PREORDER: boolean,
    SKU: string,
    PRODUCT_GENDER: 'Men' | 'Women' | 'Both',
    products: ProductType[],
    categoryConnections: CategoryConnectionsType[],
    productBrand: ProductBrandType,
    productReviews: ProductReviewType[],
    productPrices: ProductPriceType[],
    productAttributeGroups: ProductAttributeGroupType[],
}

const mapDispatchToProps = {
    setSelectedProductsAction: actions.setSelectedProducts
}

const ProductsSelect: FC<typeof mapDispatchToProps> = ({ setSelectedProductsAction }) => {
    const [products, setProducts] = useState<Array<ProductType>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState<Array<ProductType>>([]);
    const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
    const [rowPerPage, setRowPerPage] = useState(2);
    const router = useRouter();

    const columns: Array<GridColDef> = [
        {
            field: 'id', headerName: 'No', type: 'number', width: 100, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{params.getValue(params.id, 'id')}</div>
                )
            }
        },
        {
            field: 'SKU', headerName: 'SKU', type: 'string', width: 125, align: 'left', headerAlign: 'left',
        },
        {
            field: 'PRODUCT_NAME', headerName: 'Product Name', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
        },
        {
            field: 'CATEGORIES', headerName: 'Categories', sortable: false, type: 'string', flex: 0.5, align: 'left', headerAlign: 'left',
            renderCell: (params: any) => {
                let categories: CategoryConnectionsType[] = [];
                let categoriesString = '';
                categories = params.getValue(params.id, 'categoryConnections');
                categories.map((categoryConnection, i: number) => {
                    if (i < categories.length - 1) {
                        categoriesString += categoryConnection.category.CATEGORY_NAME + ', ';
                    } else {
                        categoriesString += categoryConnection.category.CATEGORY_NAME;
                    }
                })
                return (
                    <div>{categoriesString}</div>
                )
            }
        },
        {
            field: 'BRAND', headerName: 'Brand', type: 'string', width: 155, align: 'left', headerAlign: 'left',
            sortComparator: (v1, v2, param1, param2) => {
                const brand1: ProductBrandType = param1.api.getCellValue(param1.id, 'productBrand');
                const brand2: ProductBrandType = param2.api.getCellValue(param2.id, 'productBrand');
                const brandName1 = brand1.NAME;
                const brandName2 = brand2.NAME;
                const result = brandName1.localeCompare(brandName2);
                return result;
            },
            renderCell: (params: any) => {
                let brand: ProductBrandType = params.getValue(params.id, 'productBrand');
                return (
                    <div>{brand.NAME}</div>
                )
            }
        },
        {
            field: 'PRICE', headerName: 'Price', type: 'string', width: 150, align: 'left', headerAlign: 'left',
            sortComparator: (v1, v2, param1, param2) => {
                const productPrices1: ProductPriceType[] = param1.api.getCellValue(param1.id, 'productPrices');
                const productPrices2: ProductPriceType[] = param2.api.getCellValue(param2.id, 'productPrices');
                const newestPrice1 = productPrices1.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime()
                    - new Date(a.CREATED_DATETIME.toString()).getTime())[0].UNIT_PRICE;
                const newestPrice2 = productPrices2.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime()
                    - new Date(a.CREATED_DATETIME.toString()).getTime())[0].UNIT_PRICE;
                return newestPrice2 - newestPrice1;
            },
            renderCell: (params: any) => {
                const productPrices: ProductPriceType[] = params.getValue(params.id, 'productPrices');
                const newestPrice = productPrices.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime()
                    - new Date(a.CREATED_DATETIME.toString()).getTime())[0].UNIT_PRICE;
                return (
                    <div>{currencyFormatter(newestPrice)}</div>
                )
            }
        },
        {
            field: 'TAX', headerName: 'Tax', type: 'string', width: 125, align: 'left', headerAlign: 'left',
            sortComparator: (v1, v2, param1, param2) => {
                const productPrices1: ProductPriceType[] = param1.api.getCellValue(param1.id, 'productPrices');
                const productPrices2: ProductPriceType[] = param2.api.getCellValue(param2.id, 'productPrices');
                const newestTax1 = productPrices1.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime()
                    - new Date(a.CREATED_DATETIME.toString()).getTime())[0].TAX;
                const newestTax2 = productPrices2.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime()
                    - new Date(a.CREATED_DATETIME.toString()).getTime())[0].TAX;
                return newestTax2 - newestTax1;
            },
            renderCell: (params: any) => {
                const productPrices: ProductPriceType[] = params.getValue(params.id, 'productPrices');
                const newestTax = productPrices.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime()
                    - new Date(a.CREATED_DATETIME.toString()).getTime())[0].TAX;
                return (
                    <div>{newestTax}</div>
                )
            }
        }
    ];

    const getAllProducts = async () => {
        setProducts([]);
        setSelectionModel([]);
        setSelectedProducts([]);
        setIsLoading(true);
        const response = await axios({
            url: 'http://localhost:5035/products/get-all',
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const data = response.data;
        data.allProducts.map((productInformation: ProductType, i: number) => {
            setProducts(oldProducts => [...oldProducts, { ...productInformation, id: i + 1 }]);
        })
        setIsLoading(false);
    }

    useEffect(() => {
        getAllProducts();
    }, [])


    const handleRowSelection = (e: any) => {
        let sProducts: Array<ProductType> = [];
        setSelectionModel(e.selectionModel);
        if (e.selectionModel.length > 0) {
            e.selectionModel.map((rowId: number) => {
                const selectedProduct = products.filter(product => product.id === rowId)[0];
                sProducts.push(selectedProduct);
            })
            setSelectedProducts(sProducts);
        } else {
            setSelectedProducts([]);
        }
    }

    const getPagingCount = () => {
        let pagingString = '';
        if (products.length <= rowPerPage) {
            pagingString = `1-${products.length} of ${products.length}`;
        } else {
            const firstIndex = (currentPage - 1) * rowPerPage + 1;
            let lastIndex = 0;
            if (currentPage < Math.ceil(products.length / rowPerPage)) {
                lastIndex = currentPage * rowPerPage;
            } else {
                lastIndex = products.length;
            }
            pagingString = `${firstIndex}-${lastIndex} of ${products.length}`;
        }
        return pagingString;
    }

    return (
        <div className="bulk-update-container">
            <LoadingBar percentCompleted={percentCompleted} />
            <div
                style={{
                    transform: selectedProducts.length > 0 ? 'scaleY(1)' : 'scaleY(0)',
                    height: selectedProducts.length > 0 ? '70px' : '0px'
                }}
                className="bulk-update-container__header">
                <p>{selectedProducts.length} products selected</p>
                <button
                    onClick={() => {
                        setSelectedProductsAction(selectedProducts);
                        router.push('/e-commerce/products/bulk-update/step-2');
                    }}
                ><i className="fas fa-edit"></i> Update</button>
            </div>
            <div className="bulk-update-container__pagination">
                <div className="bulk-update-container__pagination__page-count">
                    <p>{getPagingCount()}</p>
                </div>
                <div className="bulk-update-container__pagination__buttons">
                    <i
                        style={{
                            opacity: currentPage > 1 ? 1 : 0.2,
                            cursor: currentPage > 1 ? 'pointer' : 'default',
                        }}
                        onClick={() => {
                            if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                            }
                        }}
                        className="fas fa-chevron-left"></i>
                    <i
                        style={{
                            opacity: currentPage < Math.ceil(products.length / rowPerPage) ? 1 : 0.2,
                            cursor: currentPage < Math.ceil(products.length / rowPerPage) ? 'pointer' : 'default',
                        }}
                        onClick={() => {
                            if (currentPage < Math.ceil(products.length / rowPerPage)) {
                                setCurrentPage(currentPage + 1);
                            }
                        }}
                        className="fas fa-chevron-right"></i>
                </div>
            </div>
            <div className="bulk-update-container__table">
                <DataGrid
                    rows={products}
                    columns={columns}
                    loading={isLoading}
                    pagination
                    page={currentPage - 1}
                    pageSize={rowPerPage}
                    rowsPerPageOptions={[rowPerPage]}
                    rowCount={products.length}
                    onPageChange={(e) => {
                        const page = e.page + 1;
                        setCurrentPage(page);
                    }}
                    hideFooterSelectedRowCount
                    hideFooterPagination
                    onSelectionModelChange={handleRowSelection}
                    selectionModel={selectionModel}
                    checkboxSelection
                />
            </div>
        </div>
    )
}

export default connect(null, mapDispatchToProps)(ProductsSelect);