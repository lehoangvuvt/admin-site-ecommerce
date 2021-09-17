import { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { actions } from "../../containers/App/actions";
import { RootReducerType } from "../../containers/reducer";
import { useRouter } from "../../hooks/router";
import Badge from '@material-ui/core/Badge';
import NotificationsNoneRounded from '@material-ui/icons/NotificationsNoneRounded';
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import "./style.scss";

const mapStateToProps = (state: RootReducerType) => {
  return {
    config: state.global.config,
    user: state.user,
  };
};

const mapDispatchToProps = {
  setSideBar: actions.setSideBar,
  openGlobalSearch: actions.openGlobalSearch,
};

const Header: FC<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = ({ setSideBar, openGlobalSearch, config, user }) => {
  const { collapsed, darkMode } = config;
  const router = useRouter();
  const [newOrders, setNewOrders] = useState<Array<{
    ID: number,
    CREATED_DATETIME: Date,
  }>>([]);
  const [isOpenNotificationModal, setOpenNotificationModal] = useState(false);
  const [isOpenMenu, setOpenMenu] = useState(false);

  const checkIsClickOptionToggle = (e: any) => {
    if (
      e.srcElement &&
      e.srcElement.parentElement &&
      e.srcElement.parentElement.firstChild &&
      e.srcElement.parentElement.firstChild.className
    ) {
      if (
        e.srcElement.parentElement.firstChild.className !==
        "header__right__avatar__circle__img"
      ) {
        setOpenMenu(false);
      }
    } else {
      setOpenMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", checkIsClickOptionToggle, false);

    return () => {
      window.removeEventListener("click", checkIsClickOptionToggle, false);
    };
  }, []);

  useEffect(() => {
    const url = "http://localhost:5035/socket/orders";
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      const socket = io(url, { transports: ["websocket"], auth: { SID: user.SID, TYPE: "admin" } });
      socket.on('newOrders', (data) => {
        setNewOrders(data['newOrders']);
      })
    }
  }, [])

  const signOut = async () => {
    await axios
      .get("http://localhost:5035/auth/logout", {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.removeItem("user");
        router.push("/login");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getDatetime = (datetime: string) => {
    let rangeTimestamp = 0;
    if (datetime) {
      rangeTimestamp = Date.now() - new Date(datetime).getTime();
    }
    let rangeTime = "";
    if (rangeTimestamp < 24 * 60 * 60 * 1000) {
      rangeTime = moment(new Date(datetime.toString())).fromNow();
    } else {
      rangeTime = moment(datetime).format("DD/MM/YYYY HH:mm");
    }
    return rangeTime;
  }

  return (
    <div
      data-theme={darkMode ? "dark-header" : "light-header"}
      className={collapsed ? "header header--collapsed" : "header"}
    >
      <div
        onClick={() => {
          setSideBar();
        }}
        className="header__left"
      >
        <i className="fas fa-bars"></i>
      </div>
      <div className="header__right">
        <div
          onClick={() => {
            openGlobalSearch();
          }}
          className="header__right__other header__right__other__search"
        >
          <i className="fas fa-search"></i>
        </div>
        <div
          onClick={() => {
            setOpenNotificationModal(!isOpenNotificationModal);
          }}
          className="header__right__other">
          <Badge badgeContent={`${newOrders.length}+`} color="secondary">
            <NotificationsNoneRounded />
          </Badge>
          {
            isOpenNotificationModal ?
              <div className="header__right__other__notification-modal">
                <div className="header__right__other__notification-modal__header">
                  <p>Notifications</p>
                </div>

                {newOrders.length > 0 ?
                  newOrders.sort((order1, order2) =>
                    new Date(order2.CREATED_DATETIME.toString()).getTime() - new Date(order1.CREATED_DATETIME.toString()).getTime())
                    .slice(0, 5)
                    .map(order =>
                      <div
                        onClick={() => {
                          router.push(`/e-commerce/orders/order/${order.ID}`);
                        }}
                        className="header__right__other__notification-modal__notification-row">
                        <div className="header__right__other__notification-modal__notification-row__left">
                          <p>Order #{order.ID} has been created</p>
                        </div>
                        <div className="header__right__other__notification-modal__notification-row__right">
                          <p>{getDatetime(order.CREATED_DATETIME.toString())}</p>
                        </div>
                      </div>
                    )
                  :
                  null
                }
                {newOrders.length > 0 ?
                  <div className="header__right__other__notification-modal__footer">
                    <p>View all notifications</p>
                  </div>
                  : null
                }
              </div>
              : null
          }
        </div>
        <div className="header__right__other">
          <i className="fas fa-cog"></i>
        </div>
        <div
          onClick={() => {
            setOpenMenu(!isOpenMenu);
          }}
          className="header__right__avatar"
        >
          <div className="header__right__avatar__circle">
            <img
              className="header__right__avatar__circle__img"
              src="https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3"
            />
          </div>
        </div>
      </div>
      {isOpenMenu ? (
        <div className="header__dropdown-menu">
          <div className="header__dropdown-menu__option">
            <div className="header__dropdown-menu__option__icon">
              <i className="far fa-envelope"></i>
            </div>
            <div className="header__dropdown-menu__option__title">
              <p>Inbox</p>
            </div>
          </div>
          <div className="header__dropdown-menu__option">
            <div className="header__dropdown-menu__option__icon">
              <i className="far fa-star"></i>
            </div>
            <div className="header__dropdown-menu__option__title">
              <p>Messages</p>
            </div>
          </div>
          <div className="header__dropdown-menu__option">
            <div className="header__dropdown-menu__option__icon">
              <i className="far fa-user"></i>
            </div>
            <div className="header__dropdown-menu__option__title">
              <p>Profile</p>
            </div>
          </div>
          <div
            className="header__dropdown-menu__option"
            onClick={() => {
              signOut();
            }}
          >
            <div className="header__dropdown-menu__option__icon">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <div className="header__dropdown-menu__option__title">
              <p>Logout</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
