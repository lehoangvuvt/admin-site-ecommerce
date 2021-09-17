import axios from "axios";
import { useEffect, useState } from "react";
import queryString from 'querystring';
import LoadingBar from "../../../../../components/LoadingBar";
import FileDownload from 'js-file-download';
import { TextField } from "@material-ui/core";
import { useRouter } from "../../../../../hooks/router";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";

type AccountReportType = {
    id: number,
    ROW_NO: number,
    SID: string,
    CREATED_DATETIME: Date,
    NAME: string,
    ACTIVE: number,
    BIRTHDAY: string,
    CUST_TYPE: number,
    GENDER: string,
    EMAIL: string
}

const AccountsReport = () => {
    const router = useRouter();
    const search = useLocation().search;
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [newCustomers, setNewCustomers] = useState<Array<AccountReportType>>([]);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [selectedFromDate, setSelectedFromDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');

    const columns: Array<GridColDef> = [
        {
            field: 'ROW_NO', sortable: false, headerName: 'No', type: 'string', width: 120, align: 'center', headerAlign: 'center',
        },
        {
            field: 'NAME', sortable: true, headerName: 'Name', type: 'string', width: 150, align: 'left', headerAlign: 'left',
        },
        {
            field: 'BIRTHDAY', sortable: true, headerName: 'Birthday', type: 'string', width: 130, align: 'left', headerAlign: 'left',
        },
        {
            field: 'EMAIL', sortable: true, headerName: 'Email', type: 'string', width: 200, align: 'left', headerAlign: 'left',
        },
        {
            field: 'GENDER', sortable: true, headerName: 'Gender', type: 'string', width: 120, align: 'left', headerAlign: 'left',
        },
        {
            field: 'CREATED_DATETIME', sortable: true, headerName: 'Created', type: 'string', width: 125, align: 'left', headerAlign: 'left',
            renderCell: (params: GridCellParams) => {
                return moment(params.getValue(params.id, 'CREATED_DATETIME')?.toString()).format('DD/MM/YYYY HH:mm')
            }
        },

        //CREATED_DATETIME

    ]

    const getAccountReport = async () => {
        const queryObj = queryString.parse(search);
        if (queryObj['?fromDate'] && queryObj['toDate']) {
            let url = `http://localhost:5035/admin/reports/accounts`;
            setSelectedFromDate(queryObj['?fromDate'].toString());
            setSelectedToDate(queryObj['toDate'].toString());
            for (let property in queryObj) {
                url += `${property}=${queryObj[property]}&`;
            }
            setIsLoading(true);
            const response = await axios({
                url: url,
                method: 'GET',
                withCredentials: true,
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setPercentCompleted(percentCompleted);
                },
            })
            const data = response.data;
            data.newCustomers.map((customer: any) => {
                setNewCustomers(oldNewCustomers => [...oldNewCustomers, { ...customer, id: customer.ROW_NO }]);
            })
            setIsLoading(false);
        } else {
            const currentDT = new Date();
            let currentDTString = '';
            currentDTString = `${currentDT.getFullYear()}-${('0' + (currentDT.getMonth() + 1)).slice(-2)}-${('0' + currentDT.getDate()).slice(-2)}T${('0' + currentDT.getHours()).slice(-2)}:${('0' + currentDT.getMinutes()).slice(-2)}`;
            setSelectedFromDate(currentDTString);
            setSelectedToDate(currentDTString);
            queryObj['fromDate'] = currentDTString;
            queryObj['toDate'] = currentDTString;
        }

    }

    useEffect(() => {
        getAccountReport();
    }, [router.query])

    const exportExcel = async () => {
        const queryObj = queryString.parse(search);
        let body = newCustomers;
        const response = await axios({
            url: "http://localhost:5035/admin/export",
            method: "POST",
            data: body,
            responseType: 'arraybuffer',
            withCredentials: true,
        });
        const fileName = `new_accounts ${queryObj['?fromDate']} ${queryObj['toDate']}`;
        FileDownload(response.data, `${fileName}.xlsx`);
    }

    const getMaxDateTime = () => {
        const currentDT = new Date();
        const currentDTString = `${currentDT.getFullYear()}-${('0' + (currentDT.getMonth() + 1)).slice(-2)}-${('0' + currentDT.getDate()).slice(-2)}T${('0' + currentDT.getHours()).slice(-2)}:${('0' + currentDT.getMinutes()).slice(-2)}`;
        return currentDTString;
    }

    const filter = (e: any) => {
        let queryObj = queryString.parse(search);
        queryObj['?fromDate'] = selectedFromDate;
        queryObj.toDate = selectedToDate;
        let url = `/reports/accounts`;
        for (let property in queryObj) {
            url += property + '=' + queryObj[`${property}`] + '&';
        }
        router.push(url.substring(0, url.length - 1));
        e.preventDefault();
    }

    return (
        <div className='accounts-report-container'>
            <LoadingBar percentCompleted={percentCompleted} />
            <div className='accounts-report-container__filters'>
                <div className='accounts-report-container__filters__filter'>
                    <TextField
                        id="date"
                        label="From date"
                        type="datetime-local"
                        InputProps={{ inputProps: { max: getMaxDateTime() } }}
                        value={selectedFromDate}
                        onChange={(e) => { setSelectedFromDate(e.target.value.toString()) }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <div className='accounts-report-container__filters__filter'>
                    <TextField
                        InputProps={{ inputProps: { max: getMaxDateTime() } }}
                        id="date"
                        label="To date"
                        type="datetime-local"
                        value={selectedToDate}
                        onChange={(e) => {
                            setSelectedToDate(e.target.value.toString())
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <div className='accounts-report-container__filters__filter'>
                    <button
                        onClick={(e) => { filter(e) }}
                    >Generate Report</button>
                </div>
            </div>

            {newCustomers.length > 0 ?
                <div className='accounts-report-container__header'>
                    <div className='accounts-report-container__header__option'>
                        <div className='accounts-report-container__header__option__icon'>
                            <i className="fas fa-download"></i>
                        </div>
                        <div
                            onClick={() => { exportExcel() }}
                            className='accounts-report-container__header__option__title'>
                            <h1>Export </h1>
                        </div>
                    </div>
                </div>
                : null}

            {newCustomers.length > 0 ?
                <div className='table'>
                    <DataGrid
                        rows={newCustomers}
                        columns={columns}
                        loading={isLoading}
                        pagination
                        page={currentPage - 1}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        rowCount={newCustomers.length}
                        onPageChange={(e) => {
                            const page = e.page + 1;
                            setCurrentPage(page);
                        }}
                    />
                </div>
                : null}
        </div >
    )
}

export default AccountsReport;
