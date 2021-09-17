import { FC, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Wallpaper from "../../resource/images/login-wallpaper.png";
import "./style.scss";
import axios from "axios";
import { useRouter } from "../../hooks/router";
import { actions } from "./actions";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${Wallpaper})`,
    backgroundRepeat: "no-repeat",
    backgroundColor: "white",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    "&>img": {
      width: "50px",
      height: "50px",
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#3f51b5",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: "50px",
  },
}));

const mapDispatchToProps = {
  setUserInfomation: actions.setUserInfomation,
};

const Login: FC<typeof mapDispatchToProps> = ({ setUserInfomation }) => {
  const classes = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState("anhtt@lbcint.com");
  const [password, setPassword] = useState("12345678");

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:5035/auth/login",
        {
          EMAIL: email,
          PASSWORD: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setUserInfomation(res.data.user_info);
        localStorage.setItem("user", JSON.stringify(res.data.user_info));
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="login-page-container">
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <DashboardIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Welcome Back
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(Login);
