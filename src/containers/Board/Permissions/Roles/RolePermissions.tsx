import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Tag, message } from "antd";
import axios from "axios";
import CreateRole from "./Modals/CreateRole";
import CreateUser from "./Modals/CreateUser";
import EditUserRoles from "./Modals/EditUserRoles";

const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getRoles();
    getUsers();
  }, []);

  const getRoles = async () => {
    await axios
      .get("http://localhost:5035/permissions/roles", { withCredentials: true })
      .then((res) =>
        res.data.roles.length > 0 ? setRoles(res.data.roles) : []
      )
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 403)
            message.error("Cannot access this resource!");
        }
      });
  };

  const getUsers = async () => {
    await axios
      .get("http://localhost:5035/permissions/user/users", {
        withCredentials: true,
      })
      .then((res) =>
        res.data.users.length > 0 ? setUsers(res.data.users) : []
      )
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 403)
            message.error("Cannot access this resource!");
        }
      });
  };

  const userCol: GridColDef[] = [
    { field: "SID", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        return params.row.FIRST_NAME + " " + params.row.LAST_NAME;
      },
    },
    {
      field: "EMAIL",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "userRole",
      headerName: "Roles",
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        let roles = params.row.userRole.map((item: any) => {
          return <Tag>{item.ROLE}</Tag>;
        });
        return roles;
      },
    },
    {
      field: "ACTIVE",
      headerName: "Status",
      flex: 1,
      filterable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let status =
          params.row.ACTIVE === 1 ? (
            <Tag color="green">ACTIVE</Tag>
          ) : params.row.ACTIVE === 0 ? (
            <Tag color="volcano">INACTIVE</Tag>
          ) : null;
        return status;
      },
    },
    {
      field: "x",
      headerName: "Actions",
      flex: 1,
      filterable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (param) => {
        return (
          <EditUserRoles roles={roles} data={param.row} getUsers={getUsers} />
        );
      },
    },
  ];

  const roleCol: GridColDef[] = [
    { field: "ID", headerName: "ID", flex: 1 },
    {
      field: "ROLE_NAME",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => {
        return <Tag>{params.row.ROLE_NAME}</Tag>;
      },
    },
  ];

  return (
    <div className="role-container">
      <div className="role-container__left">
        <div className="role-container__header">
          <div className="role-container__header__left">Roles</div>
          <CreateRole getRoles={getRoles} />
        </div>
        <div
          className="role-container__table"
          style={{ height: 400, width: "calc(100% - 20px)", padding: 5 }}
        >
          <DataGrid
            rows={roles}
            getRowId={(row) => row.ID}
            columns={roleCol}
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>
      </div>
      <div className="role-container__right">
        <div className="role-container__header">
          <div className="role-container__header__left">Users</div>
          <CreateUser getUsers={getUsers} />
        </div>

        <div
          className="role-container__table"
          style={{ height: 400, width: "calc(100% - 20px)", padding: 5 }}
        >
          <DataGrid
            rows={users}
            getRowId={(row) => row.SID}
            columns={userCol}
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;
