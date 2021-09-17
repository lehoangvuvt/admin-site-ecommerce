import { FC, useEffect, useState } from "react";
import { Container, Box, Typography, FormControl, InputLabel, Button, FormHelperText } from '@material-ui/core'
import './style.scss'
import axios from "axios";
import { Select, MenuItem } from '@material-ui/core'

interface StoreType {
    STORE_CODE: string;
    NAME: string;
}

const MainStore: FC = () => {
    const [stores, setStores] = useState<StoreType[]>([]);
    const [chooseStore, setChooseStore] = useState<any>("");
    const [showHelperText, setShowHelperText] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            const response = await axios({
                method: "GET",
                url: "http://localhost:5035/stores",
                withCredentials: true
            })
            if (response.status === 200) {
                let storesList: StoreType[] = [];
                response.data.stores.map((store: any) => {
                    storesList.push({
                        STORE_CODE: store.STORE_CODE,
                        NAME: store.NAME
                    })
                })
                setStores(storesList);
            }
        }

        async function fetchChooseStore() {
            const response = await axios({
                method: "GET",
                url: "http://localhost:5035/stores/store-default-ecom",
                withCredentials: true
            })
            if (response.status === 200) {
                setChooseStore(response.data.store_default.STORE_CODE);
            }
        }
        fetchData();
        fetchChooseStore();
    }, [])

    const handleSave = async () => {
        if (chooseStore && chooseStore !== "") {
            const response = await axios({
                method: "POST",
                url: `http://localhost:5035/stores/store-default-ecom/${chooseStore}`,
                withCredentials: true
            })
            if (response.status === 200) {
                alert("Success");
            }
        }
        else 
            setShowHelperText(true);
    }   

    return (
        <Container className="root">
            <Box className="storeBox">
                <Typography>Set up the default store code for store E-commerce</Typography>
            </Box>
            <Box className="bodyBox">
                <FormControl className="storeCodeInput">
                    <InputLabel id="choose-store-code">Store Code</InputLabel>
                    <Select
                        value={chooseStore}
                        onChange={(e) => {setChooseStore(e.target.value); setShowHelperText(false)}}
                    >
                        {
                            stores.map((store) => {
                                return <MenuItem value={store.STORE_CODE}>{store.STORE_CODE} - {store.NAME}</MenuItem>
                            })
                        }
                    </Select>
                    {showHelperText ? <FormHelperText error={showHelperText}>Choose one store code</FormHelperText> : null}
                </FormControl>
                <br/>
                <br/>
                <div>
                <Button variant="contained" color="primary" onClick={() => handleSave()}>
                    Save
                </Button>
                </div>
            </Box>
        </Container>
    )
}

export default MainStore;