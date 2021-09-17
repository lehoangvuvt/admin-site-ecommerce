import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Tag, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateRolePerm from "./Modals/CreateRolePerm";
import EditRolePermission from "./Modals/EditRolePerm";

const ResourcePermissions = () => {
  const [resources, setResources] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getResources();
    getRolesPerm();
  }, []);

  const getResources = async () => {
    await axios
      .get("http://localhost:5035/permissions/resources", {
        withCredentials: true,
      })
      .then((res) =>
        res.data.resources.length > 0 ? setResources(res.data.resources) : []
      )
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 403)
            message.error("Cannot access this resource!");
        }
      });
  };

  const getRolesPerm = async () => {
    await axios
      .get("http://localhost:5035/permissions/roles/perm", {
        withCredentials: true,
      })
      .then((res) => {
        let data = res.data.roles;
        if (data.length > 0) {
          data.map((item: any, idx: any) => (item["id"] = idx + 1));
        } else {
          setRoles([]);
        }
        setRoles(data);
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 403)
            message.error("Cannot access this resource!");
        }
      });
  };

  const roleCol: GridColDef[] = [
    {
      field: "ROLE_NAME",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "RESOURCE",
      headerName: "Resource",
      flex: 1,
    },
    {
      field: "RIGHT",
      headerName: "Rights",
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        let data = params.row.RIGHT.split(",");
        let rights = data.map((item: any) => {
          return <Tag>{item}</Tag>;
        });
        return rights;
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
          <EditRolePermission data={param.row} getRolesPerm={getRolesPerm} />
        );
      },
    },
  ];

  const resCol: GridColDef[] = [
    { field: "RESOURCE_PATH", headerName: "Resource path", flex: 1 },
    {
      field: "DESCRIPTION",
      headerName: "Description",
      flex: 1,
    },
  ];

  return (
    <div className="res-container">
      <div className="res-container__left">
        <div className="res-container__header">
          <div className="res-container__header__left">Resources</div>
        </div>
        <div
          className="res-container__table"
          style={{ height: 400, width: "calc(100% - 20px)", padding: 5 }}
        >
          <DataGrid
            rows={resources}
            getRowId={(row) => row.ID}
            columns={resCol}
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>
      </div>
      <div className="res-container__right">
        <div className="res-container__header">
          <div className="res-container__header__left">Permissions</div>
          <CreateRolePerm resources={resources} getRolesPerm={getRolesPerm} />
        </div>

        <div
          className="res-container__table"
          style={{ height: 400, width: "calc(100% - 20px)", padding: 5 }}
        >
          <DataGrid
            rows={roles}
            getRowId={(row) => row.id}
            columns={roleCol}
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
};

export default ResourcePermissions;
