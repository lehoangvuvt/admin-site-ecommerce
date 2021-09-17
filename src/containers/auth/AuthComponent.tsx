import { withRouter } from "react-router-dom";
import { useRouter } from "../../hooks/router";
import { RootReducerType } from "../reducer";
import { FC } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: RootReducerType) => {
  return {
    userInfo: state.user.userInfo,
  };
};

const AuthComponent: FC<ReturnType<typeof mapStateToProps>> = (
  props: any,
  { userInfo }
) => {
  const router = useRouter();

  if (!localStorage.getItem("user")) {
    router.push("/login");
  }
  return <div>{props.children}</div>;
};

export default withRouter(connect(mapStateToProps)(AuthComponent));
