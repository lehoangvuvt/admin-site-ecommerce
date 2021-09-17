import { FC } from 'react'
import {
  Box, TableContainer, Typography, Table, TableHead, TableBody, TableRow, TableCell, Switch, Menu, IconButton, MenuItem,
  Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button, Backdrop, CircularProgress
} from '@material-ui/core'
import { More, MoreHoriz } from '@material-ui/icons'
import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import {useRouter} from '../../../../hooks/router'

interface PromotionTabProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface PromotionType {
  SID: string;
  PROMO_NAME: string;
  DISCOUNT_REASON: string;
  START_DATE: string;
  END_DATE: string;
  START_TIME: number;
  END_TIME: number;
  APPLY_COUNT: number;
  ACTIVE: boolean;
}

const PromotionTab: FC<PromotionTabProps> = ({ children, index, value }) => {
  const router = useRouter();
  const [isLoadData, setIsLoadData] = useState<boolean>(false);
  const [listPromo, setListPromo] = useState<PromotionType[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteItem, setDeleteItem] = useState<null | PromotionType>(null);
  const [showBackDrop, setShowBackDrop] = useState<boolean>(false);
  useEffect(() => {

    async function fetchData() {
      const response = await axios({
        method: "GET",
        url: `http://localhost:5035/promotion/list/${index}`,
        withCredentials: true
      })
      // console.log(response);
      if (response.status === 200 && response.data) {
        let tempLst: PromotionType[] = [];
        response.data.map((item: any) => {
          tempLst.push({
            SID: item.SID,
            PROMO_NAME: item.PROMO_NAME,
            DISCOUNT_REASON: item.DISCOUNT_REASON,
            START_DATE: item.START_DATE,
            END_DATE: item.END_DATE,
            START_TIME: item.START_TIME,
            END_TIME: item.END_TIME,
            APPLY_COUNT: item.APPLY_COUNT,
            ACTIVE: item.ACTIVE
          })
        })
        setListPromo(tempLst);
      }
    }

    if (value === index && !isLoadData) {
      fetchData();
    }
  }, [value])

  const handleChangeCheckBox = async (index: number) => {
    let items: PromotionType[] = [...listPromo];
    let active: boolean = !items[index].ACTIVE;
    items[index].ACTIVE = active;
    setListPromo(items);
    //Update to database
    const response = await axios({
      method: "PUT",
      url: `http://localhost:5035/promotion/active/${items[index].SID}/${active ? 1 : 0}`,
    })
  };

  const convertTimeStr = (time: number) => {
    let temp: string = time.toString();
    while (temp.length < 2)
      temp = "0" + temp;
    return temp;
  }

  const convertTime = (time: number) => {
    let hour: string = convertTimeStr(Math.floor(time / 3600));
    let minute: string = convertTimeStr(Math.floor((time % 3600) / 60));
    let second: string = convertTimeStr((time % 3600) % 60);
    return `${hour}:${minute}:${second}`
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialog = (item: PromotionType) => {
    setDeleteItem(item);
  }

  const performDelete = async () => {
    let item: PromotionType | null = deleteItem;
    if (item) {
      setDeleteItem(null);
      setShowBackDrop(true);
      const response = await axios({
        method: "DELETE",
        url: `http://localhost:5035/promotion/delete/${item.SID}`,
        withCredentials: true
      })
      setShowBackDrop(false);
      if (response.status === 200)
        setListPromo(listPromo.filter(ele => (item && ele.SID !== item.SID)));
      else
        alert(response.data);
    }
  }

  const handleEdit = (SID: string) => {
    if (SID) 
      router.push(`/e-commerce/promotion/edit?id=${SID}`)
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Promotion Name</TableCell>
                  <TableCell>Discount Reason</TableCell>
                  <TableCell>START DATE</TableCell>
                  <TableCell>END DATE</TableCell>
                  <TableCell align="center">START TIME</TableCell>
                  <TableCell align="center">END TIME</TableCell>
                  <TableCell align="center">COUNT</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  listPromo.length > 0 ? (
                    listPromo.map((item, index) => (
                      <TableRow>
                        <TableCell>{index}</TableCell>
                        <TableCell>{item.PROMO_NAME}</TableCell>
                        <TableCell>{item.DISCOUNT_REASON}</TableCell>
                        <TableCell>{moment(item.START_DATE).format('DD-MM-YYYY')}</TableCell>
                        <TableCell>{moment(item.END_DATE).format("DD-MM-YYYY")}</TableCell>
                        <TableCell align="center">{convertTime(item.START_TIME)}</TableCell>
                        <TableCell align="center">{convertTime(item.END_TIME)}</TableCell>
                        <TableCell align="center">{item.APPLY_COUNT ? item.APPLY_COUNT : 'Unlimited'}</TableCell>
                        <TableCell>
                          <Switch
                            name="checkbox"
                            checked={item.ACTIVE}
                            color="primary"
                            onChange={() => handleChangeCheckBox(index)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={handleClick}
                          >
                            <MoreHoriz />
                          </IconButton>
                          <Menu
                            id="action"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                          >
                            <MenuItem onClick={() => handleEdit(item.SID)}>Edit</MenuItem>
                            <MenuItem onClick={() => handleDialog(item)}>Delete</MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                    :
                    <Typography style={{ textAlign: 'center' }}>No promotion in list</Typography>

                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Dialog
        open={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
      >
        <DialogTitle>Delete promotion</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-text">Are you sure to want to delete promotion ?</DialogContentText>
        </DialogContent>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <DialogActions>
            <Button color="primary" onClick={() => setDeleteItem(null)}>No</Button>
          </DialogActions>
          <DialogActions>
            <Button color="primary" onClick={() => performDelete()}>Yes</Button>
          </DialogActions>
        </div>
      </Dialog>
      <Backdrop open={showBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default PromotionTab;