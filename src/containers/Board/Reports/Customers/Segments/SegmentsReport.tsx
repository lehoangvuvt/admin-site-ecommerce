import axios from "axios";
import { useEffect, useState } from "react";
import queryString from 'querystring';
import LoadingBar from "../../../../../components/LoadingBar";
import FileDownload from 'js-file-download';
import { TextField } from "@material-ui/core";
import { useRouter } from "../../../../../hooks/router";
import { useLocation } from "react-router-dom";

const SegmentsReport = () => {
    const router = useRouter();
    const search = useLocation().search;
    const [segments, setSegments] = useState<Array<{ name: string, amount: number }>>([]);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [selectedFromDate, setSelectedFromDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');

    const getSegmentsReport = async () => {
        const queryObj = queryString.parse(search);
        if (queryObj['?fromDate'] && queryObj['toDate']) {
            setSelectedFromDate(queryObj['?fromDate'].toString());
            setSelectedToDate(queryObj['toDate'].toString());
            let url = `http://localhost:5035/admin/reports/segments`;
            for (let property in queryObj) {
                url += `${property}=${queryObj[property]}&`;
            }
            const response = await axios({
                url,
                method: 'GET',
                withCredentials: true,
                onDownloadProgress: (progressEvent: ProgressEvent) => {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setPercentCompleted(percentCompleted);
                },
            })
            const data = response.data;
            setSegments(data.segments);
        } else {
            const currentDT = new Date();
            let currentDTString = '';
            currentDTString = `${currentDT.getFullYear()}-${('0' + (currentDT.getMonth() + 1)).slice(-2)}-${('0' + currentDT.getDate()).slice(-2)}T${('0' + currentDT.getHours()).slice(-2)}:${('0' + currentDT.getMinutes()).slice(-2)}`;
            setSelectedFromDate(currentDTString);
            setSelectedToDate(currentDTString);
        }
    }

    useEffect(() => {
        getSegmentsReport();
    }, [router.query])

    const exportExcel = async () => {
        let body = segments;
        const response = await axios({
            url: "http://localhost:5035/admin/export",
            method: "POST",
            data: body,
            responseType: 'arraybuffer',
            withCredentials: true,
        });
        FileDownload(response.data, 'Report.xlsx');
    }

    const getMaxDateTime = () => {
        const currentDT = new Date();
        const currentDTString = `${currentDT.getFullYear()}-${('0' + (currentDT.getMonth() + 1)).slice(-2)}-${('0' + currentDT.getDate()).slice(-2)}T${('0' + currentDT.getHours()).slice(-2)}:${('0' + currentDT.getMinutes()).slice(-2)}`;
        return currentDTString;
    }

    const filter = (e: any) => {
        let queryObj = queryString.parse(search);
        queryObj['?fromDate'] = selectedFromDate;
        queryObj.toDate = selectedToDate;
        let url = `/reports/segments`;
        for (let property in queryObj) {
            url += property + '=' + queryObj[`${property}`] + '&';
        }
        router.push(url.substring(0, url.length - 1));
        e.preventDefault();
    }

    const viewDetails = (
        segment: {
            name: string;
            amount: number;
        }) => {
        const queryObj = queryString.parse(search);
        let url = `/reports/segments/details`;
        queryObj['stype'] = segment.name.toLowerCase().replace(' ', '_');
        for (let property in queryObj) {
            url += `${property}=${queryObj[property]}&`;
        }
        router.push(url.substring(0, url.length - 1));
    }

    return (
        <div className='segments-report-container'>
            <LoadingBar percentCompleted={percentCompleted} />
            <div className='segments-report-container__filters'>
                <div className='segments-report-container__filters__filter'>
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
                <div className='segments-report-container__filters__filter'>
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
                <div className='segments-report-container__filters__filter'>
                    <button
                        onClick={(e) => { filter(e) }}
                    >Generate Report</button>
                </div>
            </div>
            {segments.length > 0 ?
                <div className='segments-report-container__header'>
                    <div className='segments-report-container__header__option'>
                        <div className='segments-report-container__header__option__icon'>
                            <i className="fas fa-download"></i>
                        </div>
                        <div
                            onClick={() => { exportExcel() }}
                            className='segments-report-container__header__option__title'>
                            <h1>Export </h1>
                        </div>
                    </div>
                </div>
                : null}

            {segments.length > 0 ?
                <div className='table'>
                    <div className='table__header'>
                        <div className='table__header__column1'>
                            <h1>Name</h1>
                        </div>
                        <div className='table__header__column2'>
                            <h1>Amount</h1>
                        </div>
                    </div>
                    {segments.map(segment =>
                        <div className='table__row'>
                            <div className='table__row__column1'>
                                <h1
                                    onClick={() => {
                                        if (segment.amount === 0) return;
                                        viewDetails(segment)
                                    }}
                                >{segment.name}</h1>
                            </div>
                            <div className='table__row__column2'>
                                <h1>{segment.amount}</h1>
                            </div>
                        </div>
                    )}
                </div>
                : null}
        </div>
    )
}

export default SegmentsReport;
