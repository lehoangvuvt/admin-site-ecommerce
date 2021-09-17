import { DataGrid, GridColDef, GridValueGetterParams } from "@material-ui/data-grid";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../components/LoadingBar";
import { useRouter } from "../../../../hooks/router";
import { ProductAttributeType } from "../../../types";

interface ColumnType {
    id: number;
}

const Attributes = () => {
    const [attributes, setAttributes] = useState<Array<ProductAttributeType & ColumnType>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const router = useRouter();

    const columns: Array<GridColDef> = [
        {
            field: 'ID', headerName: 'ID', type: 'number', flex: 0.6, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{params.getValue(params.id, 'ID')}</div>
                )
            }
        },
        {
            field: 'ATTRIBUTE_NAME', headerName: 'Attribute Name', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{params.getValue(params.id, 'ATTRIBUTE_NAME')}</div>
                )
            }
        },
        {
            field: 'LABEL_TEXT', headerName: 'Label', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{params.getValue(params.id, 'LABEL_TEXT')}</div>
                )
            }
        },
        {
            field: 'VALUE_TYPE', headerName: 'Value Type', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{params.getValue(params.id, 'VALUE_TYPE')}</div>
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

    const getAttributes = async () => {
        setIsLoading(true);
        const response = await axios({
            url: 'http://localhost:5035/products/attributes',
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const data = response.data;
        data.attributes.map((attribute: ProductAttributeType) => {
            setAttributes(oldAttribute => [...oldAttribute, { ...attribute, id: attribute.ID }]);
        })
        setIsLoading(false);
    }

    useEffect(() => {
        getAttributes();
    }, [])

    return (
        <div className="attributes-container">
            <LoadingBar percentCompleted={percentCompleted} />
            <div className="attributes-container__header">
                <button
                    onClick={() => {
                        router.push('/e-commerce/attributes/create-attribute')
                    }}
                >Create Attribute</button>
            </div>
            <div className="attributes-container__table">
                {attributes.length > 0 ?
                    <DataGrid
                        rows={attributes}
                        columns={columns}
                        loading={isLoading}
                        pagination
                        page={currentPage - 1}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        rowCount={attributes.length}
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

export default Attributes;