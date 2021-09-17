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
    id: number,
    SEARCH_TERM: string,
    COUNT:number,
    TOTAL_RECORD:number,
    MODIFIED_DATETIME: string,
}




const SearchTerm = () => {
    const [lists, setSearchString] = useState<Array<arrType>>([]);
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
            field: 'id', headerName: 'ID', width: 100, type: 'string', resizable: true, align: 'center', headerAlign: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'SEARCH_TERM', headerName: 'SEARCH TERM', width: 400, type: 'string', resizable: true, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'COUNT', headerName: 'COUNT', width: 140, type: 'string', resizable: true, align: 'right', headerAlign: 'right',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: 'TOTAL_RECORD', headerName: 'TOTAL RECORD', width: 200, type: 'string', resizable: true, align: 'right', headerAlign: 'right',
            renderCell: (params: GridValueGetterParams) => {
                return <p>{params.value}</p>
            }
        },
        {
            field: "MODIFIED_DATETIME",
            headerName: "DATE",
            flex: 0.8,
            renderCell: (params) => {
              return moment(params.row.CREATED_DATETIME).format("DD/MM/YYYY, HH:mm");
            },
          },
        
        
    ];
    const getSearchString = async (fromdate:string,todate:string) => {
        const response = await axios({
            url: `http://localhost:5035/admin/reports/SearchTerm?FROM=${fromdate}&TO=${todate}`,
            method: 'GET',
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const SearchString = response.data;
        setSearchString(SearchString.details.SearchString);
        console.log(SearchString);
    }
    useEffect(() => {
        //getBestsellers(firstDay,date);
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
                    onClick={(e) => { getSearchString(fromDate,toDate) }}
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
        {isLoading ?
                    <div id="message-container">
                        <div
                            style={{ borderLeftColor: '#3f51b5' }}
                            id="message-modal">
                            <img src="https://www.pngitem.com/pimgs/m/341-3416354_blue-tick-icon-success-icon-png-transparent-png.png" />
                            Your order has been placed
                                <i className="fa fa-arrow-left"></i> Go back to homepage
                        </div>
                    </div>
                    : null
                }
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

export default SearchTerm;
