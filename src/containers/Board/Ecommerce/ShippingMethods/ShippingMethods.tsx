import { DataGrid, GridColDef, GridValueGetterParams } from "@material-ui/data-grid";
import axios from "axios";
import { formatter as currencyFormatter } from "../../../../utils/currency.formatter";
import { useEffect, useState } from "react";
import { ShippingMethodType } from "../../../types";
import { useRouter } from "../../../../hooks/router";

type DataGridType = {
    id: number,
}

type ShippingMethodAndDataGridType = ShippingMethodType & DataGridType;

const ShippingMethods = () => {
    const router = useRouter();
    const [shippingMethods, setShippingMethods] = useState<Array<ShippingMethodAndDataGridType>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const columns: Array<GridColDef> = [
        {
            field: "ID",
            headerName: "ID",
            flex: 0.5,
            type: "string",
            resizable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "SHIPPING_METHOD_NAME",
            headerName: "Name",
            flex: 1,
            type: "string",
            resizable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "DESCRIPTION",
            headerName: "Description",
            flex: 1.5,
            type: "string",
            resizable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "FLAT_PRICE",
            headerName: "Flat Price",
            flex: 1,
            type: "number",
            resizable: true,
            align: "left",
            headerAlign: "left",
            renderCell: (params: GridValueGetterParams) => {
                return <p>{currencyFormatter(params.value)} per order</p>;
            },
        },
        {
            field: " ",
            headerName: "Action",
            flex: 0.5,
            type: "string",
            resizable: true,
            align: "center",
            sortable: false,
            headerAlign: "center",
            renderCell: (params: GridValueGetterParams) => {
                return <i
                    onClick={() => {
                        router.push(`shipping-methods/${params.getValue(params.id, 'ID')}`);
                    }}
                    style={{
                        cursor: 'pointer',
                        fontSize: '1rem',
                        color: '#3f51b5'
                    }}
                    className="far fa-edit"></i>;
            },
        },
    ]

    const getAllShippingMethods = async () => {
        const response = await axios({
            url: "http://localhost:5035/shipping-methods",
            method: "GET",
            withCredentials: true,
        })
        const data = response.data;
        data.shippingMethods.map((method: ShippingMethodType, i: number) => {
            setShippingMethods(oldShippingMethods => [...oldShippingMethods, { ...method, id: i }]);
        })
    }

    useEffect(() => {
        getAllShippingMethods();
    }, [])

    return (
        <div className="shipping-methods-container">
            <div className="shipping-methods-container__header">
                <button
                    onClick={() => {
                        router.push('/e-commerce/shipping-methods/create-new')
                    }}
                >Create New Method</button>
            </div>
            <div className='table'>
                <DataGrid
                    rows={shippingMethods}
                    columns={columns}
                    page={currentPage - 1}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    rowCount={shippingMethods.length}
                    onPageChange={(e) => {
                        const page = e.page + 1;
                        setCurrentPage(page);
                    }}
                    disableSelectionOnClick
                />
            </div>
        </div>
    )
}

export default ShippingMethods;