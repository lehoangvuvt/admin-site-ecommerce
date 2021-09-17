import Main from "../../../../components/Main";
import RolePermissions from "./RolePermissions";
import 'antd/lib/modal/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/select/style/css';
import 'antd/lib/tag/style/css';
import '../../../../table.scss';
import "./style.scss";

const Roles = () => {
  return (
    <Main
      title1={"Permissions"}
      title2={"Roles"}
      children={<RolePermissions />}
    />
  );
};

export default Roles;
