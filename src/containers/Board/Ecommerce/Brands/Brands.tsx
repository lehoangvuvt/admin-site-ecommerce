import { DataGrid, GridColDef, GridValueGetterParams } from "@material-ui/data-grid";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../components/LoadingBar";
import { useRouter } from "../../../../hooks/router";
import { ProductBrandType } from "../../../types";

interface ColumnType {
    id: number;
}

const Brands = () => {
    const [brands, setBrands] = useState<Array<ProductBrandType & ColumnType>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const router = useRouter();

    const columns: Array<GridColDef> = [
        {
            field: 'id', headerName: 'No', type: 'number', flex: 0.6, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{params.getValue(params.id, 'id')}</div>
                )
            }
        },
        {
            field: 'NAME', headerName: 'Name', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{params.getValue(params.id, 'NAME')}</div>
                )
            }
        },
        {
            field: 'CREATED_DATETIME', headerName: 'Created', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{moment(params.getValue(params.id, 'CREATED_DATETIME')?.toString()).format('DD/MM/YYYY HH:mm')}</div>
                )
            }
        },
    ];

    const getAttributeSets = async () => {
        setIsLoading(true);
        const response = await axios({
            url: 'http://localhost:5035/products/brands',
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const data = response.data;
        data.brands.map((brand: ProductBrandType, i: number) => {
            setBrands(oldBrands => [...oldBrands, { ...brand, id: i + 1 }]);
        })
        setIsLoading(false);
    }

    useEffect(() => {
        getAttributeSets();
    }, [])

    return (
        <div className="brands-container">
            <LoadingBar percentCompleted={percentCompleted} />
            <div className="brands-container__header">
                <button
                    onClick={() => {
                        router.push('/e-commerce/brands/create-brand')
                    }}
                >Create Brand</button>
            </div>
            <div className="brands-container__table">
                <DataGrid
                    rows={brands}
                    columns={columns}
                    loading={isLoading}
                    pagination
                    page={currentPage - 1}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    rowCount={brands.length}
                    onPageChange={(e) => {
                        const page = e.page + 1;
                        setCurrentPage(page);
                    }}
                    checkboxSelection
                />
            </div>
        </div>
    )
}

export default Brands;