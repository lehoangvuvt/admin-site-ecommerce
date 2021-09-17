import { useEffect, useState } from "react";
import queryString from 'querystring';
import { useLocation } from "react-router-dom";
import FileDownload from 'js-file-download';
import { formatter as currencyFormatter } from '../../../../../utils/currency.formatter';
import { useRouter } from "../../../../../hooks/router";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@material-ui/data-grid";
import LoadingBar from "../../../../../components/LoadingBar";
import moment from "moment";

type CustomerType = {
    id: number,
    SID: string,
    NAME: string,
    BIRTHDAY: string,
    EMAIL: string,
    PHONE: string,
    ADDRESS: string,
    TOTAL_SPENT?: number,
    PURCHASE_DATE?: Date,
}

const SegmentDetailsReport = () => {
    const router = useRouter();
    const search = useLocation().search;
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [customers, setCustomers] = useState<Array<CustomerType>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const sharedColumns: Array<GridColDef> = [
        {
            field: 'id', sortable: false, headerName: 'No', type: 'string', width: 100, align: 'center', headerAlign: 'center',
        },
        {
            field: 'NAME', sortable: false, headerName: 'Name', type: 'string', width: 150, align: 'left', headerAlign: 'left',
        },
        {
            field: 'BIRTHDAY', sortable: false, headerName: 'Birthday', type: 'string', width: 125, align: 'left', headerAlign: 'left',
        },
        {
            field: 'EMAIL', sortable: false, headerName: 'Email', type: 'string', width: 200, align: 'left', headerAlign: 'left',
        },
        {
            field: 'PHONE', sortable: false, headerName: 'Phone', type: 'string', width: 125, align: 'left', headerAlign: 'left',
        },
        {
            field: 'ADDRESS', sortable: false, headerName: 'Address', type: 'string', width: 350, align: 'left', headerAlign: 'left',
        },
    ];

    const highSpendersColumns: Array<GridColDef> = [
        ...sharedColumns,
        {
            field: 'TOTAL_SPENT', sortable: false, headerName: 'Total Spent', type: 'number', width: 200, align: 'center', headerAlign: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return currencyFormatter(params.getValue(params.id, 'TOTAL_SPENT'));
            }
        }
    ]

    const oneTimersColumns: Array<GridColDef> = [
        ...sharedColumns,
        {
            field: 'PURCHASE_DATE', sortable: false, headerName: 'Purchase Date', type: 'string', width: 200, align: 'center', headerAlign: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return moment(params.getValue(params.id, 'PURCHASE_DATE')?.toString()).format('DD/MM/YYYY, HH:mm');
            }
        }
    ]

    const idleCustomersColumns: Array<GridColDef> = [
        ...sharedColumns,
        {
            field: 'ACTIVE', sortable: false, headerName: 'Active', type: 'string', width: 100, align: 'center', headerAlign: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return params.getValue(params.id, 'ACTIVE');
            }
        }
    ]

    const getSegmentDetails = async () => {
        setIsLoading(true);
        const queryObj = queryString.parse(search);
        let url = `http://localhost:5035/admin/reports/segment-details`;
        for (let property in queryObj) {
            url += `${property}=${queryObj[property]}&`;
        }
        url = url.substring(0, url.length - 1);
        const response = await axios({
            url,
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            },
        })
        const data = response.data;
        data.customers.map((customer: CustomerType, i: number) => {
            setCustomers(oldCustomers => [...oldCustomers, { ...customer, id: i + 1 }]);
        })
        setIsLoading(false);
    }

    useEffect(() => {
        getSegmentDetails();
    }, [])

    const exportExcel = async () => {
        const queryObj = queryString.parse(search);
        let body: Array<{
            ROW_NO: number,
            SID: string,
            NAME: string,
            BIRTHDAY: string,
            EMAIL: string,
            PHONE: string,
            ADDRESS: string,
            TOTAL_SPENT?: number,
            PURCHASE_DATE?: string,
            ACTIVE?: number,
        }> = [];
        customers.map(customer => {
            if (customer.TOTAL_SPENT) {
                body.push({
                    ROW_NO: customer.id,
                    SID: customer.SID,
                    NAME: customer.NAME,
                    BIRTHDAY: customer.BIRTHDAY,
                    EMAIL: customer.EMAIL,
                    PHONE: customer.PHONE,
                    ADDRESS: customer.ADDRESS,
                    TOTAL_SPENT: customer.TOTAL_SPENT,
                })
            } else if (customer.PURCHASE_DATE) {
                body.push({
                    ROW_NO: customer.id,
                    SID: customer.SID,
                    NAME: customer.NAME,
                    BIRTHDAY: customer.BIRTHDAY,
                    EMAIL: customer.EMAIL,
                    PHONE: customer.PHONE,
                    ADDRESS: customer.ADDRESS,
                    PURCHASE_DATE: moment(customer.PURCHASE_DATE).format('DD/MM/YYYY, HH:mm'),
                })
            }
        })
        const response = await axios({
            url: "http://localhost:5035/admin/export",
            method: "POST",
            data: body,
            responseType: 'arraybuffer',
            withCredentials: true,
        });
        const fileName = `${queryObj['stype']} ${queryObj['?fromDate']} ${queryObj['toDate']}`;
        FileDownload(response.data, `${fileName}.xlsx`);
    }

    const getColumns = () => {
        let columns: Array<GridColDef> = [];
        const queryObj = queryString.parse(search);
        switch (queryObj['stype']) {
            case 'high_spenders':
                columns = highSpendersColumns;
                break;
            case 'one_timers':
                columns = oneTimersColumns;
                break;
            case 'idle_customers':
                columns = idleCustomersColumns;
                break;
            default:
                break;
        }
        return columns;
    }

    return (
        <div className='report-segment-details-container'>
            <LoadingBar percentCompleted={percentCompleted} />
            <div className='report-segment-details-container__header'>
                <div className='report-segment-details-container__header__option'>
                    <div className='report-segment-details-container__header__option__icon'>
                        <i className="fas fa-download"></i>
                    </div>
                    <div
                        onClick={() => { exportExcel() }}
                        className='report-segment-details-container__header__option__title'>
                        <h1>Export </h1>
                    </div>
                </div>
            </div>
            <div className='report-segment-details-container__table'>
                {customers.length > 0 ?
                    <DataGrid
                        rows={customers}
                        columns={getColumns()}
                        loading={isLoading}
                        pagination
                        page={currentPage - 1}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        rowCount={customers.length}
                        onPageChange={(e) => {
                            const page = e.page + 1;
                            setCurrentPage(page);
                        }}
                    />
                    : null}
            </div>
        </div>
    )
}

export default SegmentDetailsReport;