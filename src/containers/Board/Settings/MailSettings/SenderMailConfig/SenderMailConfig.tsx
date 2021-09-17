import { useEffect, useState } from "react";
import axios from "axios";
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@material-ui/core";
import LoadingBar from "../../../../../components/LoadingBar";

const SenderMailConfig = () => {
    const serviceList = [
        { name: "Gmail" },
        { name: "Mail.ru" },
        { name: "Outlook365" }
    ];
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [isTogglePassword, setTogglePassword] = useState(false);
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [openServiceName, setOpenServiceName] = useState(false);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [serviceName, setServiceName] = useState<string>("");

    const getSenderMail = async () => {
        setLoading(true);
        const response = await axios({
            url: "http://localhost:5035/setting/mail-settings/sender-mail",
            method: "GET",
            withCredentials: true,
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            },
        });
        const data = response.data;
        if (data.senderMail) {
            setEmailAddress(data.senderMail.EMAIL_ADDRESS);
            setPassword(data.senderMail.PASSWORD);
            setServiceName(data.senderMail.SERVICE_NAME);
            setError(false);
        } else {
            setError(true);
        }
        setLoading(false);
    }

    const handleCloseServiceName = () => {
        setOpenServiceName(false);
    };

    const handleOpenServiceName = () => {
        setOpenServiceName(true);
    };

    const updateSenderMail = async () => {
        const body = {
            EMAIL_ADDRESS: emailAddress,
            PASSWORD: password,
            SERVICE_NAME: serviceName,
        };
        const response = await axios({
            url: "http://localhost:5035/setting/mail-settings/sender-mail/update",
            method: "PUT",
            withCredentials: true,
            data: body,
        });
        const data = response.data;
        if (data.error) {
            alert("Update error");
        } else {
            alert("Update successfully");
        }
    }

    useEffect(() => {
        getSenderMail();
    }, [])

    return (
        !isLoading && !error ?
            !error ?
                <div className="sender-mail-container">
                    <br />
                    <FormControl
                        style={{ width: "100%" }}
                    >
                        <InputLabel htmlFor="component-outlined">Service</InputLabel>
                        <Select
                            id="component-outlined"
                            open={openServiceName}
                            onClose={handleCloseServiceName}
                            onOpen={handleOpenServiceName}
                            value={serviceName}
                            onChange={(e) => {
                                setServiceName(e.target.value as string);
                            }}
                        >
                            {serviceList.map(service =>
                                <MenuItem value={service.name}>
                                    {service.name}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl
                        style={{ width: "100%" }}
                        required
                        variant="outlined">
                        <InputLabel htmlFor="component-outlined">Email Address</InputLabel>
                        <OutlinedInput
                            required
                            type="text"
                            id="component-outlined"
                            value={emailAddress}
                            onChange={(e) => { setEmailAddress(e.target.value) }}
                            label="Email Address" />
                    </FormControl>
                    <FormControl
                        style={{ width: "100%" }}
                        required
                        variant="outlined">
                        <InputLabel htmlFor="component-outlined">Password</InputLabel>
                        <OutlinedInput
                            required
                            type={isTogglePassword ? "text" : "password"}
                            id="component-outlined"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            label="Password" />
                    </FormControl>

                    <a onClick={() => {
                        if (isTogglePassword) {
                            setTogglePassword(false);
                        } else {
                            setTogglePassword(true);
                        }
                    }}
                    >{isTogglePassword ? "Hide password" : "Show password"}
                    </a>
                    <button
                        onClick={() => {
                            updateSenderMail();
                        }}
                    >Save</button>
                </div>
                :
                <p>Error</p>
            :
            <LoadingBar percentCompleted={percentCompleted} />
    )
}

export default SenderMailConfig;