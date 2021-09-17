import { Box, Container, Tab, Tabs, Typography, Button } from "@material-ui/core"
import { useState } from "react";
import PromotionTab from "./PromotionTab";
import {useRouter} from '../../../../hooks/router'
import './style.scss';


const PromotionDetail: React.FC = () => {
    const router = useRouter();
    const [valueTab, setValueTab] = useState(0);

    const handleChanges = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValueTab(newValue);
    }

    return (
        <Container className="root">
            <Box className="addPromotionBox">
                <Typography>Create promotion and manage current and upcoming ones</Typography>
                <Button variant="contained" color="primary" onClick={() => router.push('/e-commerce/promotion/add-promotion')}>
                    Add promotion
                </Button>
            </Box>
            <Tabs
                textColor="primary"
                indicatorColor="primary"
                value={valueTab}
                onChange={handleChanges}
            >
                <Tab label={'Current & Upcoming'} />
                <Tab label="Past"/>
                <Tab label="All"/>
            </Tabs>
            <PromotionTab value={valueTab} index={0}>
                {valueTab}
            </PromotionTab>
            <PromotionTab value={valueTab} index={1}>
                {valueTab}
            </PromotionTab>
            <PromotionTab value={valueTab} index={2}>
                {valueTab}
            </PromotionTab>
        </Container>
    )
}

export default PromotionDetail;