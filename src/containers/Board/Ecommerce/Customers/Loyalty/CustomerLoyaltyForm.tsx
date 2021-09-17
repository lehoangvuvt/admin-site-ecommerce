import { Box, Container, TextField, Typography, Button, Divider, CircularProgress, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import './style.scss'
import { useRouter } from "../../../../../hooks/router";
import { useEffect, useRef } from "react";
import axios from 'axios';
import { RootReducerType } from "../../../../reducer";
import {connect} from 'react-redux'
import { actionsCustomerLoyalty } from "./action";
import {useState} from 'react'
import { CustomerLoyaltyLevelDTO } from "../../../../types";
import LoyaltyLevelForm from "./LoyaltyLevelForm";
import { NumberFormatCustom } from "../../../../../components/NumberFormatCustom";


const mapStateToProps = (state: RootReducerType) => {
    return {
        loyalty: state.loyalty.loyalty,
        setLoyaltyRateResult: state.loyalty.setLoyaltyRate,
        setLoyaltyLevelResult: state.loyalty.setLoyaltyLevel
    }
}

const mapDispatchToProps = {
    getCustomerLoyalty: actionsCustomerLoyalty.getCustomerLoyalty,
    setCustomerLoyaltyRate: actionsCustomerLoyalty.setCustomerLoyaltyRate,
    setCustomerLoyaltyLevel: actionsCustomerLoyalty.setCustomerLoyaltyLevel
}

type IndexType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const CustomerLoyaltyForm: React.FC<IndexType> = ({getCustomerLoyalty, setCustomerLoyaltyRate, setCustomerLoyaltyLevel, setLoyaltyLevelResult, loyalty, setLoyaltyRateResult}) => {
    const router = useRouter();
    const [loyaltyRate, setLoyaltyRate] = useState<number>(0);
    const [loyaltyLevel, setLoyaltyLevel] = useState<CustomerLoyaltyLevelDTO[]>([]);
    const [isLoadingBtnLoyaltyRate, setIsLoadingBtnLoyaltyRate] = useState<boolean>(false);
    const [openSnackBarLoyaltyRate, setOpenSnackBarLoyaltyRate] = useState<boolean>(false);
    const [isLoadingBtnLoyaltyLevel, setisLoadingBtnLoyaltyLevel] = useState<boolean>(false);
    const [openSnackBarLoyaltyLevel, setOpenSnackBarLoyaltyLevel] = useState<boolean>(false);
    const itemsRef = useRef(new Array(loyaltyLevel.length));
    // const [itemsRef,setItemsRef] = useState(useRef(new Array(loyaltyLevel.length)));
    useEffect(() => {
        getCustomerLoyalty();
    }, [])

    useEffect(() => {
        setLoyaltyRate(loyalty.loyaltyRate ?loyalty.loyaltyRate.RATE: 0);
        setLoyaltyLevel(loyalty.loyaltyLevel);
    },[loyalty])

    useEffect(() => {
        if (setLoyaltyRateResult.success === undefined) return;
        // console.log(setLoyaltyRateResult);
        setIsLoadingBtnLoyaltyRate(false);
        setOpenSnackBarLoyaltyRate(true);
    }, [setLoyaltyRateResult.duration])

    useEffect(() =>{
        console.log(setLoyaltyLevelResult)
        if (setLoyaltyLevelResult.success === undefined) return;
        setisLoadingBtnLoyaltyLevel(false);
        setOpenSnackBarLoyaltyLevel(true);
    },[setLoyaltyLevelResult.duration])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data: CustomerLoyaltyLevelDTO[] = [];
        itemsRef.current.map(item => {
            if (!item) return;
            data.push(item.getMyState());
        })
        if (data.length > 0) {
            setisLoadingBtnLoyaltyLevel(true);
            setCustomerLoyaltyLevel(data);
        }
    }

    const addLoyaltyLevel = () => {
        let newCustomerLoyalty: CustomerLoyaltyLevelDTO;
        setLoyaltyLevel(loyaltyLevel => [...loyaltyLevel, newCustomerLoyalty]);
    }

    const deleteLoyalty = (key: number) => {
        let data: CustomerLoyaltyLevelDTO[] = [];
        itemsRef.current.map(item => {
            if (!item) return;
            data.push(item.getMyState());
        })
        setLoyaltyLevel(loyaltyLevel.filter((loyalty, index) => loyalty.ID !== key));
        let dataFilter: CustomerLoyaltyLevelDTO[] = data.filter((item) => item.ID !== key);
        console.log(dataFilter);
        for (let i = 0; i < dataFilter.length; i++) {
            const element = dataFilter[i];
            itemsRef.current[i].removeItem(element);
        }
        
    }

    const updateLoyaltyRate = () => {
        if (!loyalty.loyaltyRate || loyaltyRate !== loyalty.loyaltyRate.RATE) {
            console.log(loyaltyRate);
            setCustomerLoyaltyRate(loyaltyRate);
            setIsLoadingBtnLoyaltyRate(true);
        }
    }

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        setOpenSnackBarLoyaltyRate(false);
      };

    const handleCloseLevel = (event?: React.SyntheticEvent, reason?: string) => {
        setOpenSnackBarLoyaltyLevel(false);
    }

    return (
        <Container className="root">
            <form onSubmit={handleSubmit}>
                <div className="sub-menu-loyalty-rate">
                    <Typography variant="h5" className="header-loyalty">
                        Loyalty Rate
                    </Typography>
                    <TextField 
                        id="đ" 
                        label="Loyalty Rate" 
                        required
                        value={loyaltyRate}
                        style={{display: 'block'}}
                        onChange={(e) => setLoyaltyRate(parseInt(e.target.value))}
                        InputProps={{
                            inputComponent: NumberFormatCustom as any,
                        }}
                    />
                    <Button color="primary" variant="contained" onClick={() => updateLoyaltyRate()}>
                        {(isLoadingBtnLoyaltyRate) ? <CircularProgress size={15} color="secondary"/>: null}
                        Update
                    </Button>
                    {
                        (setLoyaltyRateResult.success !== undefined) &&
                        <Snackbar open={openSnackBarLoyaltyRate} autoHideDuration={4000} onClose={handleClose} >
                        {
                             (setLoyaltyRateResult.success)?
                            <Alert onClose={handleClose} severity="success">
                                Update Loyalty Rate Successfully
                            </Alert>
                            :
                            <Alert severity="error">
                                Something went wrong. Cannot update loyalty rate
                            </Alert>
                        }
                        </Snackbar>
                    }
                    
                </div>
                <Divider />
                <div className="sub-menu-loyalty">
                    <Container className="heading-loyalty" disableGutters={true}>
                        <Typography variant="h5" className="header-loyalty">
                            Loyalty Level
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => addLoyaltyLevel()}>
                            Add new
                        </Button>
                    </Container>
                    {
                        loyaltyLevel.map((item,index) => 
                            (
                            <LoyaltyLevelForm ref={(element):any => itemsRef.current[index] = element} key={index} keytt={item.ID} deleteFunc={deleteLoyalty}{...item}/>
                        ))
                    }
                </div>
                <div className="">
                    <Button type="submit" variant="contained" color="primary">
                        {(isLoadingBtnLoyaltyLevel) ? <CircularProgress size={15} color="secondary"/>: null}
                        Submit
                    </Button>
                </div>
                {
                        (setLoyaltyLevelResult.success !== undefined) &&
                        <Snackbar open={openSnackBarLoyaltyLevel} autoHideDuration={4000} onClose={handleCloseLevel} >
                        {
                             (setLoyaltyLevelResult.success)?
                            <Alert onClose={handleCloseLevel} severity="success">
                                Update Loyalty Level Successfully
                            </Alert>
                            :
                            <Alert severity="error">
                                {setLoyaltyLevelResult.message}
                            </Alert>
                        }
                        </Snackbar>
                    }
            </form>
        </Container>
    )
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomerLoyaltyForm);