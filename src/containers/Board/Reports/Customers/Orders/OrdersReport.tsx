import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridSortModel, GridSortModelParams, GridValueGetterParams } from '@material-ui/data-grid';
import axios from 'axios';
import FileDownload from 'js-file-download';
import queryString from 'querystring';
import { formatter as currencyFormatter } from '../../../../../utils/currency.formatter';
import { OrderInformationType, OrderType } from '../../../../types';
import { useRouter } from '../../../../../hooks/router';
import { Router, useLocation } from 'react-router-dom';
import LoadingBar from '../../../../../components/LoadingBar';
import moment from 'moment';
import { TextField } from '@material-ui/core';

type CustomersListType = {
    id: string,
    SID: string,
    NAME: string,
    BIRTHDAY: string,
    EMAIL: string,
    GENDER: string,
    PHONE: string,
    ADDRESS: string,
    segments: Array<string>,
    orders: Array<OrderInformationType>,
}

const OrdersReports = () => {
    const router = useRouter();
    const search = useLocation().search;
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchString, setSearchString] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<Array<CustomersListType>>([]);
    const [selectedOrders, setSelectedOrders] = useState<Array<OrderInformationType>>([]);
    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: 'CREATED_DATETIME', sort: 'desc' },
    ]);
    const [selectedFromDate, setSelectedFromDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');

    const columns: Array<GridColDef> = [
        {
            field: 'NAME', sortable: true, headerName: 'Name', type: 'string', width: 150, align: 'left', headerAlign: 'left',
        },
        {
            field: 'EMAIL', sortable: true, headerName: 'Email', type: 'string', width: 200, align: 'left', headerAlign: 'left',
        },
        {
            field: 'BIRTHDAY', sortable: true, headerName: 'Birthday', type: 'string', width: 130, align: 'left', headerAlign: 'left',
        },
        {
            field: 'PHONE', sortable: true, headerName: 'Phone', type: 'string', width: 125, align: 'left', headerAlign: 'left',
        },
        {
            field: 'ADDRESS', sortable: true, headerName: 'Address', type: 'string', width: 280, align: 'left', headerAlign: 'left',
        },
        {
            field: 'FirstPurchase', sortable: false, headerName: 'First Purchase', type: 'string', width: 150, align: 'left', headerAlign: 'left',
            renderCell: (params: any) => {
                const orders = params.getValue(params.id, 'orders');
                if (orders.length === 0) return <p></p>;
                const firstDate = params.getValue(params.id, 'orders').sort((a: OrderInformationType, b: OrderInformationType) => new Date(a.CREATED_DATETIME.toString()).getTime() - new Date(b.CREATED_DATETIME.toString()).getTime())[0].CREATED_DATETIME;
                return <p>{moment(firstDate).format('DD/MM/YYYY, HH:mm')}</p>
            }
        },
        {
            field: 'LastPurchase', sortable: false, headerName: 'Last Purchase', type: 'string', width: 150, align: 'left', headerAlign: 'left',
            renderCell: (params: any) => {
                const orders = params.getValue(params.id, 'orders');
                if (orders.length === 0) return <p></p>;
                const latestDate = params.getValue(params.id, 'orders').sort((a: OrderInformationType, b: OrderInformationType) => new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime())[0].CREATED_DATETIME;
                return <p>{moment(latestDate).format('DD/MM/YYYY, HH:mm')}</p>
            }
        },
        {
            field: 'orders', sortable: true, headerName: 'Total Orders', type: 'number', width: 150, align: 'center', headerAlign: 'center',
            sortComparator: (v1, v2, param1, param2) =>
                param1.api.getCellValue(param1.id, 'orders').length - param2.api.getCellValue(param2.id, 'orders').length,
            renderCell: (params: any) => {
                const orders = params.getValue(params.id, 'orders');
                if (orders.length === 0) return <p>0</p>;
                const totalOrders = params.getValue(params.id, 'orders').length;
                return <p>{totalOrders}</p>
            }
        },
        {
            field: 'AverageAmount', sortable: true, headerName: 'AVG.AMT', type: 'number', width: 140, headerAlign: 'left', align: 'left',
            sortComparator: (v1, v2, param1, param2) => {
                const orders1 = param1.api.getCellValue(param1.id, 'orders');
                const orders2 = param2.api.getCellValue(param2.id, 'orders');
                const totalAmount1 = orders1.reduce((total: number, order: OrderInformationType) => total + parseFloat(order.TRANSACTION_TOTAL_WITH_TAX.toString()), 0);
                const totalAmount2 = orders2.reduce((total: number, order: OrderInformationType) => total + parseFloat(order.TRANSACTION_TOTAL_WITH_TAX.toString()), 0);
                const totalOrders1 = param1.api.getCellValue(param1.id, 'orders').length;
                const totalOrders2 = param2.api.getCellValue(param2.id, 'orders').length;
                const avgAmmount1 = parseFloat(totalAmount1) / totalOrders1;
                const avgAmmount2 = parseFloat(totalAmount2) / totalOrders2;
                return avgAmmount1 - avgAmmount2;
            },
            renderCell: (params: any) => {
                const orders = params.getValue(params.id, 'orders');
                if (orders.length === 0) return <p>{currencyFormatter(0)}</p>;
                const totalAmount = orders.reduce((total: number, order: OrderInformationType) => total + parseFloat(order.TRANSACTION_TOTAL_WITH_TAX.toString()), 0);
                const totalOrders = params.getValue(params.id, 'orders').length;
                const avgAmmount = parseFloat(totalAmount) / totalOrders;
                return <p>{currencyFormatter(parseFloat(avgAmmount.toString()).toFixed(2))}</p>
            }
        },
        {
            field: 'TotalAmount', sortable: true, headerName: 'TOT.AMT', type: 'number', width: 140, headerAlign: 'left', align: 'left',
            sortComparator: (v1, v2, param1, param2) => {
                const orders1 = param1.api.getCellValue(param1.id, 'orders');
                const orders2 = param2.api.getCellValue(param2.id, 'orders');
                const totalAmount1 = orders1.reduce((total: number, order: OrderInformationType) => total + parseFloat(order.TRANSACTION_TOTAL_WITH_TAX.toString()), 0);
                const totalAmount2 = orders2.reduce((total: number, order: OrderInformationType) => total + parseFloat(order.TRANSACTION_TOTAL_WITH_TAX.toString()), 0);
                return totalAmount1 - totalAmount2;
            },
            renderCell: (params: any) => {
                const orders = params.getValue(params.id, 'orders');
                if (orders.length === 0) return <p>{currencyFormatter(0)}</p>;
                const totalAmount = orders.reduce((total: number, order: OrderInformationType) => total + parseFloat(order.TRANSACTION_TOTAL_WITH_TAX.toString()), 0);
                return <p>{currencyFormatter(parseFloat(totalAmount).toFixed(2))}</p>
            }
        },
    ];

    const getCustomers = async () => {
        const queryObj = queryString.parse(search);
        if (queryObj['fromDate'] && queryObj['toDate']) {
            setSelectedFromDate(queryObj['fromDate'].toString());
            setSelectedToDate(queryObj['toDate'].toString());
        } else {
            const currentDT = new Date();
            let currentDTString = '';
            currentDTString = `${currentDT.getFullYear()}-${('0' + (currentDT.getMonth() + 1)).slice(-2)}-${('0' + currentDT.getDate()).slice(-2)}T${('0' + currentDT.getHours()).slice(-2)}:${('0' + currentDT.getMinutes()).slice(-2)}`;
            setSelectedFromDate(currentDTString);
            setSelectedToDate(currentDTString);
            queryObj['fromDate'] = currentDTString;
            queryObj['toDate'] = currentDTString;
        }
        let url = `http://localhost:5035/admin/reports/customers`;
        for (let property in queryObj) {
            url += `${property}=${queryObj[property]}&`;
        }
        if (queryObj['?q'] && queryObj['?q'] !== '*') setSearchString(queryObj['?q'].toString());
        setIsLoading(true);
        const response = await axios({
            url: url.substring(0, url.length - 1),
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            },
        })
        const data = response.data;
        const customers = data.customers;
        setCustomers(customers);
        setIsLoading(false);
        if (queryObj['page']) setCurrentPage(parseInt(queryObj['page'].toString()));
    }

    const filter = (e: any) => {
        let queryObj = queryString.parse(search);
        queryObj.fromDate = selectedFromDate;
        queryObj.toDate = selectedToDate;
        let url = `/reports/orders`;
        for (let property in queryObj) {
            url += property + '=' + queryObj[`${property}`] + '&';
        }
        router.push(url.substring(0, url.length - 1));
        e.preventDefault();
    }

    useEffect(() => {
        getCustomers();
    }, [router.query])

    const exportExcel = async () => {
        let body: Array<{
            SID: string,
            NAME: string,
            BIRTHDAY: string,
            EMAIL: string,
            PHONE: string,
            ADDRESS: string,
            FIRST_PURCHASE: string,
            LAST_PURCHASE: string,
            TOTAL_ORDERS: number,
            AVG_AMT: number,
            TOT_AMT: number,
        }> = [];
        const calculateData = customers.map(customer => {
            const totalAmount = parseFloat(customer.orders.reduce((total: number, order) => total + order.TRANSACTION_TOTAL_WITH_TAX, 0).toString()).toFixed(2);
            const totalOrders = customer.orders.length;
            const avgAmmount = parseFloat(totalAmount) / totalOrders;
            const ADDRESS = customer.ADDRESS;
            const orders = customer.orders;
            let firstDate = '';
            let latestDate = '';
            if (orders.length === 0) {
                firstDate = '';
                latestDate = '';
            } else {
                firstDate = customer.orders.sort((a: OrderInformationType, b: OrderInformationType) => new Date(a.CREATED_DATETIME.toString()).getTime() - new Date(b.CREATED_DATETIME.toString()).getTime())[0].CREATED_DATETIME.toString();
                latestDate = customer.orders.sort((a: OrderInformationType, b: OrderInformationType) => new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime())[0].CREATED_DATETIME.toString();
            }
            const FIRST_PURCHASE = moment(firstDate).format('DD/MM/YYYY, HH:mm');
            const LAST_PURCHASE = moment(latestDate).format('DD/MM/YYYY, HH:mm');
            body.push({
                SID: customer.SID,
                NAME: customer.NAME,
                BIRTHDAY: customer.BIRTHDAY,
                EMAIL: customer.EMAIL,
                PHONE: customer.PHONE,
                ADDRESS,
                FIRST_PURCHASE,
                LAST_PURCHASE,
                TOTAL_ORDERS: customer.orders.length,
                AVG_AMT: avgAmmount,
                TOT_AMT: parseFloat(totalAmount),
            });
            return body;
        })
        await Promise.all(calculateData);
        const response = await axios({
            url: "http://localhost:5035/admin/export",
            method: "POST",
            data: body,
            responseType: 'arraybuffer',
            withCredentials: true,
        });
        const queryObj = queryString.parse(search);
        let fileName = '';
        if (queryObj['fromDate'] && queryObj['toDate']) {
            fileName = `customer_orders ${queryObj['fromDate']} ${queryObj['toDate']}`;
        } else {
            fileName = `customer_orders ${getMaxDateTime()} ${getMaxDateTime()}`;
        }
        FileDownload(response.data, `${fileName}.xlsx`);
    }

    const validateDate = (date: string) => {
        let valid = true;
        const timestamp = new Date(date).getTime();
        const currentTimestamp = new Date().getTime();
        if (timestamp > currentTimestamp) valid = false;
        return valid;
    }

    const getMaxDateTime = () => {
        const currentDT = new Date();
        const currentDTString = `${currentDT.getFullYear()}-${('0' + (currentDT.getMonth() + 1)).slice(-2)}-${('0' + currentDT.getDate()).slice(-2)}T${('0' + currentDT.getHours()).slice(-2)}:${('0' + currentDT.getMinutes()).slice(-2)}`;
        return currentDTString;
    }

    return (
        <div className='report-customers-container'>
            <div className='report-customers-container__filters'>
                <div className='report-customers-container__filters__filter'>
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
                <div className='report-customers-container__filters__filter'>
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
                <div className='report-customers-container__filters__filter'>
                    <button
                        onClick={(e) => { filter(e) }}
                    >Generate Report</button>
                </div>
            </div>

            {customers.length > 0 ?
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
                {customers.length > 0 ?
                    <DataGrid
                        rows={customers}
                        columns={columns}
                        loading={isLoading}
                        pagination
                        page={currentPage - 1}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        rowCount={customers.length}
                        onPageChange={(e) => {
                            const page = e.page + 1;
                            setCurrentPage(page);
                            let queryObj = queryString.parse(search);
                            queryObj['page'] = page.toString();
                            let url = `/reports/customers`;
                            for (let property in queryObj) {
                                url += property + '=' + queryObj[`${property}`] + '&';
                            }
                            router.push(url.substring(0, url.length - 1));
                        }}
                    />
                    : null}
            </div>
        </div >
    )
}

export default OrdersReports;