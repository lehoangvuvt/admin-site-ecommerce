import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../../components/LoadingBar";
import { useRouter } from "../../../../../hooks/router";
import { MailSettingType, MailTemplateType } from "../../../../types";

type DataGridType = {
    id: number,
}

type MailTemplateAndDataGridType = MailTemplateType & DataGridType;

const MailSettingDetails = () => {
    const router = useRouter();
    const [mailSetting, setMailSetting] = useState<MailSettingType>();
    const [mailTemplates, setMailTemplates] = useState<Array<MailTemplateAndDataGridType>>([]);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const columns: Array<GridColDef> = [
        {
            field: 'ID', sortable: true, headerName: 'ID', type: 'string', width: 100, align: 'center', headerAlign: 'center',
        },
        {
            field: 'TEMPLATE_NAME', sortable: true, headerName: 'Template Name', type: 'string', flex: 1, align: 'center', headerAlign: 'center',
        },
        {
            field: 'MAIL_SUBJECT', sortable: true, headerName: 'Subject', type: 'string', flex: 1.25, align: 'center', headerAlign: 'center',
        },
        {
            field: 'MAIL_CONTENTS', sortable: true, headerName: 'Contents', type: 'string', flex: 1.5, align: 'center', headerAlign: 'center',
        },
        {
            field: 'CREATED_DATETIME', sortable: true, headerName: 'Created At', type: 'string', flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params: GridCellParams) => {
                return moment(params.getValue(params.id, 'CREATED_DATETIME')?.toString()).format('DD/MM/YYYY HH:mm')
            }
        },
        {
            field: ' ', sortable: false, headerName: ' ', type: 'string', width: 80, align: 'center', headerAlign: 'center',
            renderCell: (params: GridCellParams) => {
                return <i
                    onClick={() => {
                        if (mailSetting) {
                            router.push(`${mailSetting.ID}/templates/${params.getValue(params.id, 'ID')}`);
                        }
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
        getMailSettingDetails();
    }, [])

    const getMailSettingDetails = async () => {
        setIsLoading(true);
        const ID = router.location.pathname.split('/')[3];
        const response = await axios({
            url: `http://localhost:5035/setting/mail-settings/details/${ID}`,
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            },
        })
        const data = response.data;
        const mailSetting = data.mailSetting;
        setMailSetting(mailSetting);
        mailSetting.mailTemplates.map((mailTemplate: MailTemplateType) => {
            const newMailTemplate = { ...mailTemplate, id: mailTemplate.ID };
            setMailTemplates(oldMailTemplates => [...oldMailTemplates, newMailTemplate]);
        })
        setIsLoading(false);
    }

    return (
        <div className="mail-setting-details-container">
            <LoadingBar percentCompleted={percentCompleted} />
            {mailSetting ?
                <div className='table'>
                    {mailTemplates.length > 0 ?
                        <DataGrid
                            rows={mailTemplates}
                            columns={columns}
                            loading={isLoading}
                            page={currentPage - 1}
                            onPageChange={(e) => {
                                const page = e.page + 1;
                                setCurrentPage(page);
                            }}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            rowCount={mailTemplates.length}
                            disableSelectionOnClick
                        />
                        : null}
                </div>
                : null}
        </div>
    )
}

export default MailSettingDetails;