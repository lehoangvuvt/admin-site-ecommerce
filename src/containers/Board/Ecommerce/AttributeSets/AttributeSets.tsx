import { DataGrid, GridColDef, GridValueGetterParams } from "@material-ui/data-grid";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../components/LoadingBar";
import { useRouter } from "../../../../hooks/router";
import { AttributeSetType } from "../../../types";

interface ColumnType {
    id: number;
}

const AttributeSets = () => {
    const [attributeSets, setAttributeSets] = useState<Array<AttributeSetType & ColumnType>>([]);
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
            field: 'SET_NAME', headerName: 'Set Name', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <div>{params.getValue(params.id, 'SET_NAME')}</div>
                )
            }
        },
        {
            field: 'productAttribute1.ATTRIBUTE_NAME', headerName: 'Main Attribute Name', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params: any) => {
                return (
                    <div>{params.getValue(params.id, 'productAttribute1').ATTRIBUTE_NAME}</div>
                )
            }
        },
        {
            field: 'productAttribute2.ATTRIBUTE_NAME', headerName: 'Sub Attribute Name', type: 'string', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params: any) => {
                return (
                    <div>{params.getValue(params.id, 'productAttribute2').ATTRIBUTE_NAME}</div>
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
            url: 'http://localhost:5035/products/attribute-set',
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const data = response.data;
        data.attributeSets.map((attributeSet: AttributeSetType) => {
            setAttributeSets(oldAttributeSets => [...oldAttributeSets, { ...attributeSet, id: attributeSet.ID }]);
        })
        setIsLoading(false);
    }

    useEffect(() => {
        getAttributeSets();
    }, [])

    return (
        <div className="attribute-sets-container">
            <LoadingBar percentCompleted={percentCompleted} />
            <div className="attribute-sets-container__header">
                <button
                    onClick={() => {
                        router.push('/e-commerce/attributes/create-attribute-set')
                    }}
                >Create Attribute Set</button>
            </div>
            <div className="attribute-sets-container__table">
                {attributeSets.length > 0 ?
                    <DataGrid
                        rows={attributeSets}
                        columns={columns}
                        loading={isLoading}
                        pagination
                        page={currentPage - 1}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        rowCount={attributeSets.length}
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

export default AttributeSets;