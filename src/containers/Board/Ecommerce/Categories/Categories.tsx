import { DataGrid, GridColDef, GridValueGetterParams } from "@material-ui/data-grid";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../components/LoadingBar";
import { useRouter } from "../../../../hooks/router";
import { CategoryType } from "../../../types";

interface ColumnType {
    id: number;
}

const Categories = () => {
    const [categories, setCategories] = useState<Array<CategoryType & ColumnType>>([]);
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
            field: 'CATEGORY_NAME', headerName: 'Name', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{params.getValue(params.id, 'CATEGORY_NAME')}</div>
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
            url: 'http://localhost:5035/categories',
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const data = response.data;
        data.categories.map((category: CategoryType, i: number) => {
            setCategories(oldCategories => [...oldCategories, { ...category, id: i + 1 }]);
        })
        setIsLoading(false);
    }

    useEffect(() => {
        getAttributeSets();
    }, [])

    return (
        <div className="categories-container">
            <LoadingBar percentCompleted={percentCompleted} />
            <div className="categories-container__header">
                <button
                    onClick={() => {
                        router.push('/e-commerce/categories/create-category')
                    }}
                >Create Category</button>
            </div>
            <div className="categories-container__table">
                {categories.length > 0 ?
                    <DataGrid
                        rows={categories}
                        columns={columns}
                        loading={isLoading}
                        pagination
                        page={currentPage - 1}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        rowCount={categories.length}
                        onPageChange={(e) => {
                            const page = e.page + 1;
                            setCurrentPage(page);
                        }}
                        checkboxSelection
                    />
                    : null}
            </div>
        </div>
    )
}

export default Categories;