import axios from "axios";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../../components/LoadingBar";
import FileDownload from 'js-file-download';
import ProductCategories from "../../../Ecommerce/Products/Product/ProductCategories";
import { formatter } from "../../../../../utils/currency.formatter";
import { TextField } from "@material-ui/core";
import moment from "moment";
import { DataGrid, GridColDef, GridValueGetterParams } from "@material-ui/data-grid";
import React from "react";
interface arrType{
    SKU:string,
    PRODUCT_NAME: string,
    CATEGORY_NAME: string,
    BRAND:string,
    QTY: string,
    VIEWED :string,
}
const ProductViewReport = () => {
    const [lists, setProduct] = useState<Array<arrType>>([]);
    
    const [fromDate, setFromdate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));
    const [toDate, setTodate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));
    const d =new Date();
    const month =d.getMonth()+1;
    const firstDay = d.getFullYear() + "-"+ month + "-" + "01"; 
    const date = d.getFullYear() + "-"+ month + "-" + d.getDate();
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = React.useState(false);


    const columns: Array<GridColDef> = [
        // {
        //     field: 'ID', headerName: 'ID', width: 100, type: 'string', resizable: true, align: 'center', headerAlign: 'center',
        //     renderCell: (params: GridValueGetterParams) => {
        //         return <p>#{params.value}</p>
        //     }
        // },
        {
            field: 'SKU', headerName: 'SKU', width: 170, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'PRODUCT_NAME', headerName: 'PRODUCT NAME', width: 400, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'CATEGORY_NAME', headerName: 'CATEGORY', width: 170, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'BRAND', headerName: 'BRAND', width: 140, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'QTY', headerName: 'QTY', width: 140, type: 'string', resizable: true, align: 'right', headerAlign: 'right',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'VIEWED', headerName: 'VIEWED', width: 140, type: 'string', resizable: true, align: 'right', headerAlign: 'right',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        // {
        //     field: 'UNIT_PRICE', headerName: 'PRICE', width: 140, type: 'number', resizable: true, align: 'left', headerAlign: 'left',
        //     renderCell: (params: GridValueGetterParams) => {
        //         const price = params.value;
        //         return <p >{formatter(price)}</p >;
        //     },
        // },
        
        
    ];
    const getProductViewProduct = async (fromdate:string,todate:string) => {
        const response = await axios({
            url: `http://localhost:5035/admin/reports/productView?FROM=${fromdate}&TO=${todate}`,
            method: 'GET',
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const dtProduct = response.data;
        setProduct(dtProduct.details.product);
        console.log(dtProduct);
    }
    
    useEffect(() => {
        
        //getProductViewProduct(firstDay,date);
    }, 
    [])

    const exportExcel = async () => {
        let body = lists;
        const response = await axios({
            url: "http://localhost:5035/admin/export",
            method: "POST",
            data: body,
            responseType: 'arraybuffer',
            withCredentials: true,
        });
        FileDownload(response.data, 'Report.xlsx');
        
    }

    return (
        <div className='report-sales-container'>
        <div className='report-sales-container__filters'>
            <div className='report-sales-container__filters__filter'>
                <TextField
                    id="date"
                    label="From date"
                    type="date"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={event => setFromdate(event.target.value)}
                />
                </div>
                <div className='report-sales-container__filters__filter'>
                <TextField
                    id="date"
                    label="To date"
                    type="date"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={event => setTodate(event.target.value)}
                />
            </div>
            <div className='report-sales-container__filters__filter'>
                <button
                    onClick={(e) => { getProductViewProduct(fromDate,toDate) }}
                >Generate Report</button>
            </div>
        </div>

        {lists.length > 0 ?
            <div className='report-customers-container__header'>
                <div className='report-customers-container__header__option'>
                    <div className='report-customers-container__header__option__icon'>
                        <i className="fas fa-download"></i>
                    </div>
                    <div
                        onClick={() => { exportExcel() }}
                        className='report-customers-container__header__option__title'>
                        <h1>Export </h1>
                    </div>
                </div>
            </div>
            : null}

        <div className='report-customers-container__customers-table'>
            <LoadingBar percentCompleted={percentCompleted} />
            <div style={{ display: 'flex', height: '100%' }}>
                    <div
                        id='list-table'
                        style={{ flexGrow: 1 }}>
                        <DataGrid
                            rows={lists}
                            columns={columns}
                            loading={isLoading}
                            pagination
                            paginationMode="server"
                            page={currentPage - 1}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            rowCount={totalRecords}
                            checkboxSelection
                            disableSelectionOnClick
                        />
                    </div>
                </div>
        </div>
    </div >
    )

}

export default ProductViewReport;
