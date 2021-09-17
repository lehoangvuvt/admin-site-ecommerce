import axios from "axios";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../../components/LoadingBar";
import FileDownload from 'js-file-download';
import ProductCategories from "../../../Ecommerce/Products/Product/ProductCategories";
import { formatter } from "../../../../../utils/currency.formatter";
import { Modal, TextField } from "@material-ui/core";
import moment from "moment";
import { orderedProduct, OrderInformationType } from "../../../../types";
import { DataGrid, GridColDef, GridSortModel, GridSortModelParams, GridValueGetterParams } from "@material-ui/data-grid";
import { useRouter } from "../../../../../hooks/router";
import { useLocation } from "react-router-dom";


import queryString from 'querystring';
import React from "react";

interface detailList{
    FIRST_NAME: string,
    LAST_NAME: string,
    EMAIL: string,
    QUANTITY: string,
    CREATED_DATETIME: string,
}
const OrderedProductReport = () => {
    
    const [fromDate, setFromdate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));;
    const [toDate, setTodate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));
    const d =new Date();
    const month =d.getMonth()+1;
    const firstDay = d.getFullYear() + "-"+ month + "-" + "01"; 
    const date = d.getFullYear() + "-"+ month + "-" + d.getDate(); 

    
    const router = useRouter();
    const search = useLocation().search;
    const [selectedID, setSelectedID] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [lists, setProduct] = useState<Array<orderedProduct>>([]);
    const [detailLists, setDetailList] = useState<Array<detailList>>([]);
    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: 'CREATED_DATETIME', sort: 'desc' },
    ]);
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
                const price = params.value;
                return <p >{formatter(price)}</p >;
            },
        },
        {
            field: 'ORDER_QTY', headerName: 'ORDER QTY', width: 180, type: 'string', resizable: true, align: 'right', headerAlign: 'right',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },{
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
                    getOrderDetail(fromDate,toDate,PSid);
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
            field: 'FIRST_NAME', headerName: 'FIRST NAME', width: 200, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'LAST_NAME', headerName: 'LAST NAME', width: 200, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'EMAIL', headerName: 'EMAIL', width: 250, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'QUANTITY', headerName: 'QUANTITY', width: 140, type: 'string', resizable: true, align: 'center', headerAlign: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'CREATED_DATETIME', headerName: 'DATE TIME', width: 300, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
    ];
    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        getorderedProduct(fromDate,toDate);
        setOpen(false);
      };
    const getorderedProduct = async (fromdate:string,todate:string) => {
        const response = await axios({
            url: `http://localhost:5035/admin/reports/orderedProduct?FROM=${fromdate}&TO=${todate}`,
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            },
        })
        const dtProduct = response.data;
        const listProduct=dtProduct.details.product;
        setProduct(listProduct);
    }

    const getOrderDetail = async (fromdate:string,todate:string,PSID:string | undefined) => {
        
        const response = await axios({
            url: `http://localhost:5035/admin/reports/orderedDetail?FROM=${fromdate}&TO=${todate}&PSID=${PSID}`,
            method: 'GET',
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const dtProduct = response.data;
        setDetailList(dtProduct.details.List);
    }
    useEffect(() => {
    }, 
    [])

    const getMaxDateTime = () => {
        const currentDT = new Date();
        const currentDTString = `${currentDT.getFullYear()}-${('0' + (currentDT.getMonth() + 1)).slice(-2)}-${('0' + currentDT.getDate()).slice(-2)}T${('0' + currentDT.getHours()).slice(-2)}:${('0' + currentDT.getMinutes()).slice(-2)}`;
        return currentDTString;
    }
    useEffect(() => {
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
    //     <div id="message-container" >
    //                     <div
    //                         style={{ borderLeftColor: '#e74c3c' }}
    //                         id="message-modal">
    //                             <button
    //                             onClick={() => {handleClose()}}>
    //                             <i className="fa fa-arrow-left"></i> Go back to order
    //                         </button>
    //                             <i ></i> Order Detail
    //                     </div>
    //                 </div>
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
                    onClick={(e) => { getorderedProduct(fromDate,toDate) }}
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
                            rowsPerPageOptions={[10]}
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

export default OrderedProductReport;
