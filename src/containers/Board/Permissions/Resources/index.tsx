import Main from "../../../../components/Main";
import ResourcePermissions from "./ResourcePermissions";
import 'antd/lib/modal/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/select/style/css';
import 'antd/lib/tag/style/css';
import '../../../../table.scss';
import "./style.scss";

const Resources = () => {
  return (
    <Main
      title1={"Permissions"}
      title2={"Resources"}
      children={<ResourcePermissions />}
    />
  );
};

export default Resources;
