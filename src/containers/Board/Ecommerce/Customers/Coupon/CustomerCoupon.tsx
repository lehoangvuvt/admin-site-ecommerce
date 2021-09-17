import { Container, Box, Typography, Button, TableContainer, TableBody, Table, TableHead, TableRow, TableCell, Tabs, Tab, Switch } from '@material-ui/core'
import './style.scss'
import { useRouter } from '../../../../../hooks/router'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { CouponList } from '../../../../types'

interface CustomerCouponTabProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const CustomerCouponTab: React.FC<CustomerCouponTabProps> = ({ value, index }) => {
    const [couponList, setCouponList] = useState<CouponList[]>([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios({
                    method: "GET",
                    url: `http://localhost:5035/customers/coupon/${index}`
                })
                if (response.status === 200)
                    setCouponList(response.data)
            }
            catch (ex) {

            }
        }
        fetchData();
    }, [])

    const handleChangeCheckBox = async (index: number) => {
        let items: CouponList[] = [...couponList];
        let active: boolean = !items[index].ACTIVE;
        items[index].ACTIVE = active;
        setCouponList(items);
        //Update to database
        const response = await axios({
            method: "PUT",
            url: `http://localhost:5035/customers/coupon/${items[index].SID}`,
            data: {
                ACTIVE: active
            }
        })
    };

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {
                value === index &&
                <Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Coupon Name</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Apply Count</TableCell>
                                    <TableCell>Active</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    couponList.length > 0 ? 
                                    couponList.map((item, index) => (
                                        <TableRow>
                                            <TableCell>{item.COUPON_NAME}</TableCell>
                                            <TableCell>{item.START_DATE}</TableCell>
                                            <TableCell>{item.END_DATE}</TableCell>
                                            <TableCell>{(item.APPLY_COUNT) ? item.APPLY_COUNT : 'Unlimited'}</TableCell>
                                            <TableCell>
                                                <Switch 
                                                    name="checkbox"
                                                    checked={item.ACTIVE}
                                                    color="primary"
                                                    onChange={() => handleChangeCheckBox(index)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    :
                                    (
                                        <Typography variant="body1">No coupon in list</Typography>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            }
        </div>
    )
}

const CustomerCoupon: React.FC = () => {
    const router = useRouter();
    const [valueTab, setValueTab] = useState(0);

    const handleChanges = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValueTab(newValue);
    }

    return (
        <Container className="root">
            <Box className="addCouponBox">
                <Typography>Create coupon and manage current and upcoming ones</Typography>
                <Button variant="contained" color="primary" onClick={() => router.push('/e-commerce/customers/coupon/add')}>
                    Add coupon
                </Button>
            </Box>
            <Tabs
                textColor="primary"
                indicatorColor="primary"
                value={valueTab}
                onChange={handleChanges}
            >
                <Tab label={'Current & Upcoming'} />
                <Tab label="Past" />
                <Tab label="In future" />
            </Tabs>
            <CustomerCouponTab value={valueTab} index={0}>
                {valueTab}
            </CustomerCouponTab>
            <CustomerCouponTab value={valueTab} index={1}>
                {valueTab}
            </CustomerCouponTab>
            <CustomerCouponTab value={valueTab} index={2}>
                {valueTab}
            </CustomerCouponTab>
        </Container>
    )
}

export default CustomerCoupon;