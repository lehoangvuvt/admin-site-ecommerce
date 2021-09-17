import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../components/LoadingBar";
import { useRouter } from "../../../../hooks/router";
import { MailSettingType } from "../../../types";

type DataGridType = {
    id: number,
}

type MailSettingAndDataGridType = MailSettingType & DataGridType;

const MailSettings = () => {
    const router = useRouter();
    const [mailSettings, setMailSettings] = useState<Array<MailSettingAndDataGridType>>([]);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const columns: Array<GridColDef> = [
        {
            field: 'ID', sortable: true, headerName: 'ID', type: 'string', width: 100, align: 'center', headerAlign: 'center',
        },
        {
            field: 'MAIL_FOR', sortable: true, headerName: 'Mail For', type: 'string', flex: 0.75, align: 'center', headerAlign: 'center',
        },
        {
            field: 'DESCRIPTION', sortable: true, headerName: 'Description', type: 'string', flex: 1.5, align: 'center', headerAlign: 'center',
        },
        {
            field: 'CREATED_DATETIME', sortable: true, headerName: 'Created At', type: 'string', flex: 0.75, align: 'center', headerAlign: 'center',
            renderCell: (params: GridCellParams) => {
                return moment(params.getValue(params.id, 'CREATED_DATETIME')?.toString()).format('DD/MM/YYYY HH:mm')
            }
        },
        {
            field: ' ', sortable: false, headerName: 'Action', type: 'string', width: 100, align: 'center', headerAlign: 'center',
            renderCell: (params: GridCellParams) => {
                return <i
                    onClick={() => {
                        router.push(`mail-settings/${params.getValue(params.id, 'ID')}`);
                    }}
                    style={{
                        cursor: 'pointer',
                        fontSize: '1rem',
                        color: '#3f51b5'
                    }}
                    className="fas fa-edit"></i>
            }
        },
    ]

    useEffect(() => {
        getAllMailSettings();
    }, [])

    const getAllMailSettings = async () => {
        setIsLoading(true);
        setMailSettings([]);
        const response = await axios({
            url: 'http://localhost:5035/setting/mail-settings',
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            },
        })
        const data = response.data;
        data.mailSettings.map((mailSetting: MailSettingType) => {
            const newMailSetting = { ...mailSetting, id: mailSetting.ID };
            setMailSettings(oldMailSettings => [...oldMailSettings, newMailSetting]);
        })
        setIsLoading(false);
    }

    return (
        <div className="mail-settings-container">
            <LoadingBar percentCompleted={percentCompleted} />
            <a
                onClick={() => {
                    router.push('/settings/sender-mail-config');
                }}
            >Configure Sender's Mail</a>
            <div className='table'>
                {mailSettings.length > 0 ?
                    < DataGrid
                        rows={mailSettings}
                        columns={columns}
                        loading={isLoading}
                        page={currentPage - 1}
                        onPageChange={(e) => {
                            const page = e.page + 1;
                            setCurrentPage(page);
                        }}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        rowCount={mailSettings.length}
                        disableSelectionOnClick
                    />
                    : null}
            </div>
        </div>
    )
}

export default MailSettings;