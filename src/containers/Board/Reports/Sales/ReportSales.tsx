import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import axios from "axios";
import moment from "moment";
import FileDownload from "js-file-download";
import { formatter as currencyFormatter } from "../../../../utils/currency.formatter";
import LoadingBar from "../../../../components/LoadingBar";
import { TextField } from "@material-ui/core";
import { Tag } from "antd";

const ReportSales = () => {
  const [orders, setOrders] = useState([]);
  const [percentCompleted, setPercentCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  useEffect(() => {
    getOrderReport();
  }, []);

  const getOrderReport = async () => {
    setIsLoading(true);
    const params = {
      from: selectedFromDate,
      to: selectedToDate,
    };
    await axios
      .get("http://localhost:5035/reports/orders", {
        params,
        withCredentials: true,
        onDownloadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setPercentCompleted(percentCompleted);
        },
      })
      .then((res) => {
        if (res.data.orders.length > 0) {
          setOrders(res.data.orders);
        } else {
          setOrders([]);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const getMaxDateTime = () => {
    const currentDT = new Date();
    const currentDTString = `${currentDT.getFullYear()}-${(
      "0" +
      (currentDT.getMonth() + 1)
    ).slice(-2)}-${("0" + currentDT.getDate()).slice(-2)}T${(
      "0" + currentDT.getHours()
    ).slice(-2)}:${("0" + currentDT.getMinutes()).slice(-2)}`;
    return currentDTString;
  };

  const orderCol: GridColDef[] = [
    {
      field: "ORDER_ID",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "CREATED_DATETIME",
      headerName: "Date Ordered",
      flex: 0.8,
      renderCell: (params) => {
        return moment(params.row.CREATED_DATETIME).format("DD/MM/YYYY, HH:mm");
      },
    },
    {
      field: "x",
      headerName: "Customer Name",
      flex: 1,
      renderCell: (params) => {
        return params.row.FIRST_NAME + " " + params.row.LAST_NAME;
      },
    },
    {
      field: "EMAIL",
      headerName: "Email",
      flex: 0.8,
    },
    {
      field: "TOTAL_ITEM_COUNT",
      headerName: "Total qty.",
      align: "right",
      headerAlign: "right",
      flex: 0.8,
    },
    {
      field: "TRANSACTION_TOTAL_TAX_AMT",
      headerName: "Tax Amount",
      align: "right",
      headerAlign: "right",
      flex: 0.8,
      renderCell: (params) => {
        return currencyFormatter(params.row.TRANSACTION_TOTAL_TAX_AMT);
      },
    },
    {
      field: "SHIPPING_AMT",
      headerName: "Shipping Amount",
      align: "right",
      headerAlign: "right",
      flex: 0.8,
      renderCell: (params) => {
        return currencyFormatter(params.row.SHIPPING_AMT);
      },
    },
    {
      field: "STATUS",
      headerName: "Status",
      flex: 0.5,
      filterable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let status =
          params.row.STATUS === 1 ? (
            <Tag color="yellow">New</Tag>
          ) : params.row.STATUS === 2 ? (
            <Tag color="blue">On Hold</Tag>
          ) : params.row.STATUS === 3 ? (
            <Tag color="cyan">Processing</Tag>
          ) : params.row.STATUS === 4 ? (
            <Tag color="gold">Store assigned</Tag>
          ) : params.row.STATUS === 5 ? (
            <Tag color="volcano">Cancelled</Tag>
          ) : params.row.STATUS === 6 ? (
            <Tag color="processing">In delivery</Tag>
          ) : params.row.STATUS === 7 ? (
            <Tag color="green">Completed</Tag>
          ) : params.row.STATUS === 8 ? (
            <Tag color="error">Closed</Tag>
          ) : params.row.STATUS === 9 ? (
            <Tag color="pink">Pick up on hold</Tag>
          ) : null;
        return status;
      },
    },
  ];

  const exportExcel = async () => {
    let body: Array<{
      ORDER_ID: string;
      CREATED_DATETIME: string;
      SID_CUSTOMER: string;
      FIRST_NAME: string;
      LAST_NAME: string;
      EMAIL: string;
      TOTAL_ITEM_COUNT: number;
      TRANSACTION_TOTAL_TAX_AMT: number;
      SHIPPING_AMT: number;
      STATUS: number;
    }> = [];
    const data = orders.map((order: any) => {
      body.push({
        ORDER_ID: order.ORDER_ID,
        CREATED_DATETIME: order.CREATED_DATETIME,
        SID_CUSTOMER: order.BIRTHDAY,
        FIRST_NAME: order.EMAIL,
        LAST_NAME: order.PHONE,
        EMAIL: order.EMAIL,
        TOTAL_ITEM_COUNT: order.TOTAL_ITEM_COUNT,
        TRANSACTION_TOTAL_TAX_AMT: order.TRANSACTION_TOTAL_TAX_AMT,
        SHIPPING_AMT: order.SHIPPING_AMT,
        STATUS: order.STATUS,
      });
      return body;
    });
    await Promise.all(data);
    const response = await axios({
      url: "http://localhost:5035/admin/export",
      method: "POST",
      data: body,
      responseType: "arraybuffer",
      withCredentials: true,
    });
    var fileName = "";
    if (selectedFromDate && selectedToDate) {
      fileName = `orders_report ${selectedFromDate} ${selectedToDate}`;
    } else {
      fileName = `orders_report ${getMaxDateTime()} ${getMaxDateTime()}`;
    }
    FileDownload(response.data, `${fileName}.xlsx`);
  };

  return (
    <div className="report-sales-container">
      <div className="report-sales-container__filters">
        <div className="report-sales-container__filters__filter">
          <TextField
            id="date"
            label="From date"
            type="datetime-local"
            InputProps={{ inputProps: { max: getMaxDateTime() } }}
            value={selectedFromDate}
            onChange={(e) => {
              setSelectedFromDate(e.target.value.toString());
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="report-sales-container__filters__filter">
          <TextField
            InputProps={{ inputProps: { max: getMaxDateTime() } }}
            id="date"
            label="To date"
            type="datetime-local"
            value={selectedToDate}
            onChange={(e) => {
              setSelectedToDate(e.target.value.toString());
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="report-sales-container__filters__filter">
          <button onClick={getOrderReport}>Generate Report</button>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="report-sales-container__header">
          <div className="report-sales-container__header__option">
            <div className="report-sales-container__header__option__icon">
              <i className="fas fa-download"></i>
            </div>
            <div
              onClick={() => {
                exportExcel();
              }}
              className="report-sales-container__header__option__title"
            >
              <h1>Export </h1>
            </div>
          </div>
        </div>
      ) : null}

      <div className="report-sales-container__sales-table">
        <LoadingBar percentCompleted={percentCompleted} />
        {orders ? (
          <DataGrid
            rows={orders}
            getRowId={(row) => row.ORDER_ID}
            columns={orderCol}
            loading={isLoading}
            pageSize={10}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ReportSales;
