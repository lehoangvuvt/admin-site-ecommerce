import axios from "axios";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../../components/LoadingBar";
import FileDownload from 'js-file-download';
import ProductCategories from "../../../Ecommerce/Products/Product/ProductCategories";
import { formatter } from "../../../../../utils/currency.formatter";
import { Modal, TextField } from "@material-ui/core";
import moment from "moment";
import { Today } from "@material-ui/icons";
import { DataGrid, GridColDef, GridValueGetterParams } from "@material-ui/data-grid";
import React from "react";
interface arrType{
    SKU:string,
    SID:string,
    PRODUCT_NAME: string,
    BRAND:string,
    UNIT_PRICE: string,
    SIZE:string,
    COLOR:string,
    CART: string,
}
interface detailList{
    CART_SID: string,
    PRODUCT_NAME: string,
    FIRST_NAME: string,
    LAST_NAME: string,
    EMAIL: string,
    QUANTITY:number,
}



const ProductInCart = () => {
    const [lists, setProduct] = useState<Array<arrType>>([]);
    const [detailLists, setDetailList] = useState<Array<detailList>>([]);
    const [fromDate, setFromdate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));;
    const [toDate, setTodate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));;
    const d =new Date();
    const month =d.getMonth()+1;
    const firstDay = d.getFullYear() + "-"+ month + "-" + "01"; 
    const date = d.getFullYear() + "-"+ month + "-" + d.getDate(); 
    const [isLoading, setIsLoading] = useState(false);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [selectedID, setSelectedID] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [open, setOpen] = React.useState(false);
    


    const checkIsClickOptionToggle = (e: any) => {
        if (e.srcElement
            && e.srcElement.parentElement
            && e.srcElement.parentElement.firstChild && e.srcElement.parentElement.firstChild.className) {
            if (e.srcElement.parentElement.firstChild.className !== 'fas fa-ellipsis-h' && e.srcElement.parentElement.firstChild.className !== 'order-option-modal__option') {
                setSelectedID(-1);
            }
        }
    }
    
    useEffect(() => {
        window.addEventListener('click', checkIsClickOptionToggle, false);
    
        return () => {
            window.removeEventListener('click', checkIsClickOptionToggle, false);
        }
    }, [])
    const columns: Array<GridColDef> = [
       
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
            field: 'BRAND', headerName: 'BRAND', width: 140, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'COLOR', headerName: 'COLOR', width: 140, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },

        {
            field: 'SIZE', headerName: 'SIZE', width: 140, type: 'string', resizable: true, align: 'right', headerAlign: 'right',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'UNIT_PRICE', headerName: 'PRICE', width: 140, type: 'number', resizable: true, align: 'right', headerAlign: 'right',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            },
        },
        {
            field: 'CART', headerName: 'CART TOTAL', width: 170, type: 'number', resizable: true, align: 'right', headerAlign: 'right',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            },
        },
        {
            field: "ACTION",
            headerName: " ",
            width: 130,
            align: "center",
            resizable: true,
            headerAlign: "center",
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: GridValueGetterParams) => {
              return (
                <div className="action-container">
                  <i
                    style={{
                      background:
                        params.getValue(params.id, "ID") &&
                        params.getValue(params.id, "ID") === selectedID
                          ? "rgba(0,0,0,0.05)"
                          : "white",
                      cursor: "pointer",
                    }}
                    onClick={(e: any) => {
                    handleOpen()
                    const PSid :string | undefined  = params.getValue(params.id.toString(), "SID")?.toString();
                    getProductInCartDetail(fromDate,toDate,PSid);
                    //   window.open('OrderDetail','jbnWindow','width=600,height=400');
                    //   console.log(value);
                    }}
                    className="fas fa-ellipsis-h"
                  ></i>
                </div>
                
              );
            },
          },
    ];
    const columnsDetail: Array<GridColDef> = [
      
        {
            field: 'CART_SID', headerName: 'CART SID', width: 200, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
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
            field: 'FIRST_NAME', headerName: 'FIRST NAME', width: 140, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value ? params.value :"GUEST" }</p>
            }
        },
        {
            field: 'LAST NAME', headerName: 'LAST NAME', width: 140, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value ? params.value :"GUEST" }</p>
            }
        },
        {
            field: 'EMAIL', headerName: 'EMAIL', width: 200, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value ? params.value :"GUEST" }</p>
            }
        },
        
        {
            field: 'CREATED_DATETIME', headerName: 'DATE TIME', width: 300, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'QUANTITY', headerName: 'QUANTITY', width: 140, type: 'string', resizable: true, align: 'right', headerAlign: 'right',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
    ];
    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        getProductInCart(fromDate,toDate);
        setOpen(false);
      };
    const getProductInCart = async (fromdate:string,todate:string) => {
        const response = await axios({
            url: `http://localhost:5035/admin/reports/getProductInCart?FROM=${fromdate}&TO=${todate}`,
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
        //getBestsellers(firstDay,date);
    }, 
    [])
    const getProductInCartDetail = async (fromdate:string,todate:string,PSID:string | undefined) => {
        
        const response = await axios({
            url: `http://localhost:5035/admin/reports/productInCartDetail?FROM=${fromdate}&TO=${todate}&PSID=${PSID}`,
            method: 'GET',
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const dtProduct = response.data;
        setDetailList(dtProduct.details.List);
    }
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


    const body =(
        <div className='report-detail-order-container'>
        <div className='report-detail-order-container__customers-table'>
            <div>
                <button onClick={() => { handleClose() }}>Go Back</button>
            </div>
            <LoadingBar percentCompleted={percentCompleted} />
            <div style={{ display: 'flex', height: '100%' }}>
                    <div
                        id='list-table'
                        style={{ flexGrow: 1 }}>
                        <DataGrid
                            rows={detailLists}
                            columns={columnsDetail}
                            loading={isLoading}
                            pagination
                            paginationMode="server"
                            page={currentPage - 1}
                            pageSize={10}
                            rowsPerPageOptions={[7]}
                            rowCount={totalRecords}
                            checkboxSelection
                            disableSelectionOnClick
                        />
                    </div>
                </div>
        </div>
    </div>
    
    )
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
                    onClick={(e) => { getProductInCart(fromDate,toDate) }}
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
                            pageSize={10}
                            rowsPerPageOptions={[7]}
                            rowCount={totalRecords}
                            checkboxSelection
                            disableSelectionOnClick
                        />
                    </div>
                </div>
        </div>
        <Modal
        open={open}
        onClose={handleClose}
        >
            {body}
        </Modal>
    </div >
    )
}

export default ProductInCart;
