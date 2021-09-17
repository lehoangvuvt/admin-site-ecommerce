import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridSortModel,
  GridSortModelParams,
  GridValueGetterParams,
} from "@material-ui/data-grid";
import axios from "axios";
import moment from "moment";
import queryString from "querystring";
import { formatter as currencyFormatter } from "../../../../utils/currency.formatter";
import { OrderInformationType } from "../../../types";
import { useRouter } from "../../../../hooks/router";
import { Router, useLocation } from "react-router-dom";
import LoadingBar from "../../../../components/LoadingBar";

export default function Orders() {
  const router = useRouter();
  const search = useLocation().search;
  const [selectedID, setSelectedID] = useState(-1);
  const [isFocusSearchBar, setIsFocusSearchBar] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [percentCompleted, setPercentCompleted] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [orders, setOrders] = useState<Array<OrderInformationType>>([]);
  const [selectedOrders, setSelectedOrders] = useState<
    Array<OrderInformationType>
  >([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "CREATED_DATETIME", sort: "desc" },
  ]);

  const checkIsClickOptionToggle = (e: any) => {
    if (
      e.srcElement &&
      e.srcElement.parentElement &&
      e.srcElement.parentElement.firstChild &&
      e.srcElement.parentElement.firstChild.className
    ) {
      if (
        e.srcElement.parentElement.firstChild.className !==
          "fas fa-ellipsis-h" &&
        e.srcElement.parentElement.firstChild.className !==
          "order-option-modal__option"
      ) {
        setSelectedID(-1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("click", checkIsClickOptionToggle, false);

    return () => {
      window.removeEventListener("click", checkIsClickOptionToggle, false);
    };
  }, []);

  const columns: Array<GridColDef> = [
    {
      field: "ID",
      headerName: "ID",
      width: 100,
      type: "string",
      resizable: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridValueGetterParams) => {
        return <p>#{params.value}</p>;
      },
    },
    {
      field: "CREATED_DATETIME",
      headerName: "Created",
      flex: 1,
      resizable: true,
      align: "left",
      headerAlign: "left",
      valueGetter: (params: GridValueGetterParams) => {
        const date = params.value;
        let rangeTimestamp = 0;
        if (date)
          rangeTimestamp = Date.now() - new Date(date.toString()).getTime();
        let rangeTime = "";
        if (rangeTimestamp < 24 * 60 * 60 * 1000) {
          if (date) rangeTime = moment(new Date(date.toString())).fromNow();
        } else {
          if (date) {
            rangeTime = moment(date.toString()).format("DD/MM/YYYY HH:mm");
          }
        }
        return `${rangeTime}`;
      },
    },
    {
      field: "MODIFIED_DATETIME",
      headerName: "Updated",
      flex: 1,
      align: "left",
      resizable: true,
      headerAlign: "left",
      valueGetter: (params: GridValueGetterParams) => {
        const date = params.value;
        let rangeTimestamp = 0;
        if (date)
          rangeTimestamp = Date.now() - new Date(date.toString()).getTime();
        let rangeTime = "...";
        if (rangeTimestamp < 24 * 60 * 60 * 1000) {
          if (date) rangeTime = moment(new Date(date.toString())).fromNow();
        } else {
          if (date) {
            rangeTime = moment(date.toString()).format("DD/MM/YYYY HH:mm");
          }
        }
        return `${rangeTime}`;
      },
    },
    {
      field: "fullname",
      headerName: "Customer",
      align: "left",
      headerAlign: "left",
      sortable: false,
      flex: 1,
      renderCell: (params: GridValueGetterParams) => {
        return (
          <p>
            {params.getValue(params.id, "S_FIRST_NAME")}{" "}
            {params.getValue(params.id, "S_LAST_NAME")}
          </p>
        );
      },
    },
    {
      field: "TRANSACTION_TOTAL_WITH_TAX",
      headerName: "Total",
      flex: 1,
      type: "number",
      resizable: true,
      align: "left",
      headerAlign: "left",
      renderCell: (params: GridValueGetterParams) => {
        const price = params.value;
        return <p className="total-price-cell">{currencyFormatter(price)}</p>;
      },
    },
    {
      field: "STATUS",
      headerName: "Status",
      type: "number",
      flex: 1,
      align: "center",
      resizable: true,
      headerAlign: "center",
      renderCell: (params: GridValueGetterParams) => {
        const getStatusName = () => {
          const { value } = params;
          let statusName = <p>Undefined</p>;
          switch (value) {
            case 1:
              statusName = <p>New order</p>;
              break;
            case 2:
              statusName = <p>On hold</p>;
              break;
            case 3:
              statusName = <p>Processing</p>;
              break;
            case 4:
              statusName = <p>Store assigned</p>;
              break;
            case 5:
              statusName = <p>Cancelled</p>;
              break;
            case 6:
              statusName = <p>In delivery</p>;
              break;
            case 7:
              statusName = <p>Completed</p>;
              break;
            default:
              break;
          }
          return statusName;
        };
        const getStatusIcon = () => {
          const { value } = params;
          let statusIcon = <i className="far fa-question-circle"></i>;
          switch (value) {
            case 1:
              statusIcon = <i className="fas fa-star"></i>;
              break;
            case 2:
              statusIcon = <i className="fas fa-pause"></i>;
              break;
            case 3:
              statusIcon = <i className="fas fa-spinner"></i>;
              break;
            case 4:
              statusIcon = <i className="fas fa-store"></i>;
              break;
            case 5:
              statusIcon = <i className="far fa-times-circle"></i>;
              break;
            case 7:
              statusIcon = <i className="far fa-check-circle"></i>;
              break;
            default:
              break;
          }
          return statusIcon;
        };
        const getStatusColor = () => {
          const { value } = params;
          let style = {
            background: "black",
            color: "white",
          };
          switch (value) {
            case 1:
              style.background = "#fff44f";
              style.color = "black";
              break;
            case 2:
              style.background = "#2c3e50";
              style.color = "white";
              break;
            case 3:
              style.background = "#3498db";
              style.color = "white";
              break;
            case 4:
              style.background = "#1abc9c";
              style.color = "white";
              break;
            case 5:
              style.background = "#e74c3c";
              style.color = "white";
              break;
            case 7:
              style.background = "#25D366";
              style.color = "white";
              break;
            default:
              break;
          }
          return style;
        };
        return (
          <div style={getStatusColor()} className="status-cell">
            {getStatusIcon()} {getStatusName()}
          </div>
        );
      },
    },
    {
      field: "ACTION",
      headerName: "Action",
      width: 130,
      align: "center",
      resizable: true,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridValueGetterParams) => {
        return (
          <div className="action-container">
            <i
              style={{
                background:
                  params.getValue(params.id, "ID") &&
                  params.getValue(params.id, "ID") === selectedID
                    ? "rgba(0,0,0,0.05)"
                    : "white",
                cursor: "pointer",
              }}
              onClick={(e: any) => {
                const value = params.getValue(params.id, "ID");
                const orderTable = document.getElementById("order-table");
                if (orderTable) {
                  setPosition({
                    x: orderTable.offsetLeft + orderTable.offsetWidth,
                    y: orderTable.offsetTop + e.target.offsetTop,
                  });
                }
                if (value) {
                  if (selectedID === value) {
                    setSelectedID(-1);
                  } else {
                    setSelectedID(parseInt(value.toString()));
                  }
                }
              }}
              className="fas fa-ellipsis-h"
            ></i>
          </div>
        );
      },
    },
  ];

  const getAllOrders = async () => {
    let queryObj = queryString.parse(search);
    let url = `http://localhost:5035/orders`;
    for (let property in queryObj) {
      url += property + "=" + queryObj[`${property}`] + "&";
    }
    if (queryObj["?q"] && queryObj["?q"] !== "*")
      setSearchString(queryObj["?q"].toString());
    url = url.substring(0, url.length - 1);
    setIsLoading(true);
    const response = await axios({
      url,
      method: "GET",
      withCredentials: true,
      onDownloadProgress: (progressEvent) => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setPercentCompleted(percentCompleted);
      },
    });
    const data = response.data;
    const orders = data.orders;
    const totalRecords = data.totalRecords;
    setOrders(orders);
    setTotalRecords(totalRecords);
    setCurrentPage(parseInt(queryObj["page"].toString()));
    setIsLoading(false);
  };

  const downloadBill = async (id: any) => {
    setIsLoading(true);
    await axios
      .get(`http://localhost:5035/orders/order/bill/${id}`, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((res) => {
        let fileName = res.headers["content-disposition"].split('"')[1];
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const sort = (params: GridSortModelParams) => {
    if (params.sortModel.length > 0) {
      let queryObj = queryString.parse(search);
      const sortField = params.sortModel[0].field.toUpperCase();
      let option = "";
      if (params.sortModel[0].sort)
        option = params.sortModel[0].sort.toUpperCase();
      queryObj["sort"] = sortField.toString() + " " + option;

      setCurrentPage(1);
      let url = `/e-commerce/orders`;
      for (let property in queryObj) {
        url += property + "=" + queryObj[`${property}`] + "&";
      }
      router.push(url.substring(0, url.length - 1));
    }
  };

  const searchOrders = (e: any) => {
    let queryObj = queryString.parse(search);
    if (searchString !== "") {
      queryObj["?q"] = searchString;
    } else {
      queryObj["?q"] = "*";
    }
    let url = `/e-commerce/orders`;
    queryObj["page"] = "1";
    setCurrentPage(1);
    for (let property in queryObj) {
      url += property + "=" + queryObj[`${property}`] + "&";
    }
    router.push(url.substring(0, url.length - 1));
    e.preventDefault();
  };

  useEffect(() => {
    getAllOrders();
  }, [router.query]);

  const selectOrder = (order: OrderInformationType) => {
    if (
      selectedOrders.filter((sOrder) => sOrder.id === order.id).length === 0
    ) {
      setSelectedOrders((oldSelectedOrders) => [...oldSelectedOrders, order]);
    } else {
      setSelectedOrders((oldSelectedOrders) =>
        oldSelectedOrders.filter((osOrder) => osOrder.id !== order.id)
      );
    }
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
    let queryObj = queryString.parse(search);
    queryObj["page"] = page.toString();
    let url = `/e-commerce/orders`;
    for (let property in queryObj) {
      url += property + "=" + queryObj[`${property}`] + "&";
    }
    router.push(url.substring(0, url.length - 1));
  };

  return (
    <div className="order-managment-container">
      <div className="order-managment-container__order-status-tabs">
        <div className="order-managment-container__order-status-tabs__tab order-managment-container__order-status-tabs__tab--active">
          All
        </div>
        <div className="order-managment-container__order-status-tabs__tab">
          New
        </div>
        <div className="order-managment-container__order-status-tabs__tab">
          On hold
        </div>
        <div className="order-managment-container__order-status-tabs__tab">
          Processing
        </div>
        <div className="order-managment-container__order-status-tabs__tab">
          Store assigned
        </div>
        <div className="order-managment-container__order-status-tabs__tab">
          Cancelled
        </div>
        <div className="order-managment-container__order-status-tabs__tab">
          In delivery
        </div>
        <div className="order-managment-container__order-status-tabs__tab">
          Completed
        </div>
        <div className="order-managment-container__order-status-tabs__tab">
          Closed
        </div>
        <div className="order-managment-container__order-status-tabs__tab">
          Pick up on hold
        </div>
      </div>
      <div className="order-managment-container__header">
        <div className="order-managment-container__header__left">
          <div
            style={{
              background: isFocusSearchBar ? "rgba(0,0,0,0.025)" : "white",
              borderBottom: isFocusSearchBar
                ? "1px solid rgba(0,0,0,0.2)"
                : "1px solid rgba(0,0,0,0.1)",
            }}
            className="order-managment-container__header__left__input-container"
          >
            <form onSubmit={searchOrders}>
              <input
                placeholder="Search order by order ID, customer email, phone or name"
                value={searchString}
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
                onFocus={() => {
                  setIsFocusSearchBar(true);
                }}
                onBlur={() => {
                  setIsFocusSearchBar(false);
                }}
                type="text"
              />
            </form>
          </div>
        </div>
        <div className="order-managment-container__header__right"></div>
      </div>
      <div className="order-managment-container__orders-container">
        <LoadingBar percentCompleted={percentCompleted} />
        {selectedID !== -1 ? (
          <div
            style={{
              left: `${position.x - 115}px`,
              top: `${position.y + 90}px`,
            }}
            className="order-option-modal"
          >
            <div
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                router.push(`/e-commerce/orders/order/${selectedID}`);
              }}
              className="order-option-modal__option"
            >
              View details
            </div>
            <div
              onClick={() => {
                downloadBill(selectedID);
              }}
              className="order-option-modal__option"
            >
              Download Bill
            </div>
          </div>
        ) : null}
        <div style={{ display: "flex", height: "100%" }}>
          <div id="order-table" style={{ flexGrow: 1 }}>
            <DataGrid
              rows={orders}
              columns={columns}
              onRowSelected={(e: any) => {
                selectOrder(e.data);
              }}
              loading={isLoading}
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={sort}
              sortingOrder={["desc", "asc"]}
              pagination
              paginationMode="server"
              page={currentPage - 1}
              pageSize={5}
              rowsPerPageOptions={[5]}
              rowCount={totalRecords}
              onPageChange={(e) => {
                const page = e.page + 1;
                changePage(page);
              }}
              checkboxSelection
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>
    </div>
  );
}
