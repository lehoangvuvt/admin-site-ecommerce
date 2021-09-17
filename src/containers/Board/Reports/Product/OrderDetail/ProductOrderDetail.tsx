import axios from "axios";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../../components/LoadingBar";
import FileDownload from 'js-file-download';
import ProductCategories from "../../../Ecommerce/Products/Product/ProductCategories";
import { formatter } from "../../../../../utils/currency.formatter";
import { TextField } from "@material-ui/core";
import moment from "moment";
import { Today } from "@material-ui/icons";
import { DataGrid, GridColDef, GridValueGetterParams } from "@material-ui/data-grid";
interface arrType{
    FIRST_NAME: string,
    LAST_NAME: string,
    EMAIL: string,
    QUANTITY: string,
    CREATED_DATETIME: string,
}




const OrderDetail = () => {
    const [lists, setProduct] = useState<Array<arrType>>([]);
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
    


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
            field: 'FIRST_NAME', headerName: 'FIRST NAME', width: 150, type: 'string', resizable: true, align: 'center', headerAlign: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'LAST_NAME', headerName: 'LAST NAME', width: 150, type: 'string', resizable: true, align: 'center', headerAlign: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'EMAIL', headerName: 'EMAIL', width: 250, type: 'string', resizable: true, align: 'center', headerAlign: 'center',
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
            field: 'CREATED_DATETIME', headerName: 'CREATED_DATETIME', width: 140, type: 'string', resizable: true, align: 'center', headerAlign: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
    ];
    const getOrderDetail = async () => {
        const PSID='073abc56-442c-4ddc-8d49-311c686d24d8';;
        const fromdate ='2021-06-21'
        const todate='2021-08-21'
        const response = await axios({
            url: `http://localhost:5035/admin/reports/orderedDetail?FROM=${fromdate}&TO=${todate}&PSID=${PSID}`,
            method: 'GET',
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const dtProduct = response.data;
        setProduct(dtProduct.details.List);
    }
    useEffect(() => {
        getOrderDetail();
    }, 
    [])

    
    return (
    <div className='report-sales-container'>
        {lists.length > 0 ?
            <div className='report-customers-container__header'>
                <div className='report-customers-container__header__option'>
                    <div className='report-customers-container__header__option__icon'>
                        <i className="fas fa-download"></i>
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

export default OrderDetail;
