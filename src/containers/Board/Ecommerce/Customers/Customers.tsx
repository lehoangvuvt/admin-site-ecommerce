import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridSortModel, GridSortModelParams, GridValueGetterParams } from '@material-ui/data-grid';
import axios from 'axios';
import moment from 'moment';
import FileDownload from 'js-file-download';
import queryString from 'querystring';
import { formatter } from '../../../../utils/currency.formatter';
import { OrderInformationType } from '../../../types';
import { useRouter } from '../../../../hooks/router';
import { Router, useLocation } from 'react-router-dom';
import LoadingBar from '../../../../components/LoadingBar';

interface CustomersListType {
    id: number,
    FIRST_NAME: string,
    LAST_NAME: string,
    BIRTH_DAY: number,
    BIRTH_MONTH: number,
    BIRTH_YEAR: number,
    EMAIL: string,
    GENDER: string,
    PHONE: string,
    CITY: string,
    DISTRICT: string,
    STREET_ADDRESS: string,
}

export default function Customers() {
    const router = useRouter();
    const search = useLocation().search;
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchString, setSearchString] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [customers, setCustomers] = useState<Array<CustomersListType>>([]);
    const [selectedOrders, setSelectedOrders] = useState<Array<OrderInformationType>>([]);
    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: 'CREATED_DATETIME', sort: 'desc' },
    ]);

    const columns: Array<GridColDef> = [
        {
            field: 'id', headerName: 'No', type: 'number', width: 100, resizable: true, align: 'center', headerAlign: 'center',
        },
        {
            field: 'fullname', headerName: 'Name', type: 'string', width: 140, resizable: true, align: 'center', headerAlign: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div className='sid-cell'>
                        <p onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                            router.push(`/e-commerce/customers/customer/${params.getValue(params.id, 'id')}`)
                        }}
                        >{params.getValue(params.id, 'FIRST_NAME')} {params.getValue(params.id, 'LAST_NAME')}</p>
                    </div>
                )
            }
        },
        { field: 'GENDER', headerName: 'Gender', type: 'string', width: 120, resizable: true, align: 'center', headerAlign: 'center' },
        {
            field: 'Birthdate', headerName: 'Birthdate', type: 'string', width: 140, resizable: true, headerAlign: 'center', align: 'center',
            renderCell: (params: GridValueGetterParams) => {
                return <p>
                    {
                        params.getValue(params.id, 'BIRTH_DAY') ?
                            `${params.getValue(params.id, 'BIRTH_DAY')}/${params.getValue(params.id, 'BIRTH_MONTH')}/${params.getValue(params.id, 'BIRTH_YEAR')}`
                            : ""
                    }
                </p>
            }
        },
        { field: 'EMAIL', headerName: 'Email', type: 'string', width: 200, resizable: true, align: 'center', headerAlign: 'center' },
        { field: 'PHONE', headerName: 'Phone', type: 'string', width: 150, resizable: true, align: 'center', headerAlign: 'center' },
        { field: 'CITY', headerName: 'City', type: 'string', width: 150, resizable: true, align: 'center', headerAlign: 'center' },
    ];

    const getCustomers = async () => {
        const queryObj = queryString.parse(search);
        let url = `http://localhost:5035/customers`;
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
        const totalRecords = data.totalRecords;
        setTotalRecords(totalRecords);
        setCustomers(customers);
        setCurrentPage(parseInt(queryObj['page'].toString()));
        setIsLoading(false);
    }

    const sort = (params: GridSortModelParams) => {
        if (params.sortModel.length > 0) {

        }
    };

    const searchCustomers = (e: any) => {
        let queryObj = queryString.parse(search);
        if (searchString !== '') {
            queryObj['?q'] = searchString;
        } else {
            queryObj['?q'] = '*';
        }
        queryObj.page = '1';
        let url = `/e-commerce/customers`;
        for (let property in queryObj) {
            url += property + '=' + queryObj[`${property}`] + '&';
        }
        router.push(url.substring(0, url.length - 1));
        e.preventDefault();
    }

    useEffect(() => {
        getCustomers();
    }, [router.query])

    const changePage = (page: number) => {
        setCurrentPage(page);
        let queryObj = queryString.parse(search);
        queryObj['page'] = page.toString();
        let url = `/e-commerce/customers`;
        for (let property in queryObj) {
            url += property + '=' + queryObj[`${property}`] + '&';
        }
        router.push(url.substring(0, url.length - 1));
    }

    const exportExcel = async () => {
        let body = customers;
        const response = await axios({
            url: "http://localhost:5035/admin/export",
            method: "POST",
            data: body,
            responseType: 'arraybuffer',
            withCredentials: true,
        });
        const fileName = 'customers';
        FileDownload(response.data, `${fileName}.xlsx`);
    }

    return (
        <div className='customer-managment-container'>
            <div className='customer-managment-container__header'>
                <div className='customer-managment-container__header__left'>
                    <div className='customer-managment-container__header__left__input-container'>
                        <form onSubmit={searchCustomers}>
                            <input
                                placeholder="Search customers by email, phone, name, city or address"
                                value={searchString}
                                onChange={(e) => {
                                    setSearchString(e.target.value);
                                }}
                                type='text' />
                        </form>
                    </div>
                </div>
                {
                    customers.length > 0 ?
                        <div className='customer-managment-container__header__option'>
                            <div className='customer-managment-container__header__option__icon'>
                                <i className="fas fa-download"></i>
                            </div>
                            <div
                                onClick={() => { exportExcel() }}
                                className='customer-managment-container__header__option__title'>
                                <h1>Export </h1>
                            </div>
                        </div>
                        :
                        null
                }
            </div>

            <div className='customer-managment-container__customers-container'>
                <LoadingBar percentCompleted={percentCompleted} />
                <DataGrid
                    rows={customers}
                    columns={columns}
                    // onRowSelected={(e: any) => {
                    //     selectOrder(e.data);
                    // }}
                    loading={isLoading}
                    // sortingMode="server"
                    // sortModel={sortModel}
                    // onSortModelChange={sort}
                    // sortingOrder={['desc', 'asc']}
                    pagination
                    page={currentPage - 1}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    rowCount={customers.length}
                    onPageChange={(e) => {
                        const page = e.page + 1;
                        changePage(page);
                    }}
                    checkboxSelection
                />
            </div>
        </div>
    );
}