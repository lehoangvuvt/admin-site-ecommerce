import { FormControl, InputLabel, OutlinedInput } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "../../../../../../hooks/router";
import { MailTemplateType } from "../../../../../types";

const TemplateDetails = () => {
    const router = useRouter();
    const [templateDetails, setTemplateDetails] = useState<MailTemplateType>();
    const [mailSubject, setMailSubject] = useState('');
    const [mailContents, setMailContents] = useState('');
    const [searchString, setSearchString] = useState('');
    const [columns, setColumns] = useState<Array<string>>([]);
    const [filteredColumns, setFilteredColumns] = useState<Array<string>>([]);

    useEffect(() => {
        getTemplateDetails();
    }, [])

    const getTemplateDetails = async () => {
        const ID = router.location.pathname.split('/')[5];
        const response = await axios({
            url: `http://localhost:5035/setting/mail-settings/templates/${ID}`,
            method: 'GET',
            withCredentials: true,
        })
        const data = response.data;
        setTemplateDetails(data.templateDetails);
        setColumns(data.columns);
        setFilteredColumns(data.columns);
        setMailSubject(data.templateDetails.MAIL_SUBJECT);
        setMailContents(data.templateDetails.MAIL_CONTENTS)
    }

    useEffect(() => {
        setFilteredColumns(columns.filter(column => column.includes(searchString.toUpperCase())));
    }, [searchString])

    // useEffect(() => {
    //     const contentsPreview = document.getElementById('contents-preview');
    //     if (contentsPreview) {
    //         contentsPreview.innerHTML = mailContents;
    //     }
    // }, [mailContents])

    const updateMailTemplateDetails = async () => {
        if (templateDetails) {
            const response = await axios({
                url: `http://localhost:5035/setting/mail-settings/templates/${templateDetails.ID}`,
                method: 'PUT',
                data: {
                    MAIL_CONTENTS: mailContents,
                    MAIL_SUBJECT: mailSubject,
                },
                withCredentials: true,
            });
            if (!response.data.error) {
                alert('Update template details success.');
            } else {
                alert('Cannot update template details. Something error');
            }
        }
    }

    return (
        <div className="template-details-container">
            <div className="template-details-container__search-bar">
                <input
                    value={searchString}
                    onChange={(e) => {
                        setSearchString(e.target.value);
                    }}
                    placeholder="Search fields here..."
                    type='text' />
            </div>
            {columns.length > 0 ?
                <div className="template-details-container__fields-container">
                    {filteredColumns.map(column =>
                        <div
                            onClick={() => {
                                setMailContents(oldMailContents => `${oldMailContents} ` + '${' + column + '}');
                            }}
                            className="template-details-container__fields-container__field">
                            <p>{column}</p>
                        </div>
                    )}
                </div>
                : null}
            <div className="template-details-container__text-container">
                {templateDetails ?
                    <>
                        <FormControl
                            style={{ width: '100%' }}
                            required
                            variant="outlined">
                            <InputLabel htmlFor="component-outlined">Mail Subject</InputLabel>
                            <OutlinedInput
                                required
                                type='text'
                                id="component-outlined"
                                value={mailSubject}
                                onChange={(e) => { setMailSubject(e.target.value) }}
                                label="Mail Subject" />
                        </FormControl>

                        <textarea
                            onChange={(e) => {
                                setMailContents(e.target.value);
                            }}
                            value={mailContents}
                        />
                    </>
                    : null}
            </div>
            {/* <div id="contents-preview" className="template-details-container__contents-preview">

            </div> */}
            <button
                onClick={() => {
                    updateMailTemplateDetails();
                }}
            >Save</button>
        </div>
    )
}

export default TemplateDetails;