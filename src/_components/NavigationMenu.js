import { elastic as Menu } from "react-burger-menu";
import "./Navigation.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, Typography, Divider } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import Cookies from "universal-cookie";
import axios from "axios";
import UserContext from "../context/UserContext";
import LabActionContext from "../context/LabActionContext";

const useStyles = makeStyles((theme) => ({
  menu: {
    position: "relative",
  },
  menuItem: {
    color: "white",
    textDecoration: "none",
    padding: 10,
    width: "100% !important",
    transition: "all 0.25s ease",
    "&:hover": {
      backgroundColor: "#53DCFD90",
      color: "#666885",
    },
    "&>a": {
      width: "100%",
    },
  },

  username: {
    textTransform: "capitalize",
    marginTop: -5,
    marginRight: 30,
    fontSize: "0.8rem",
    color: "#F0EEEB",
    textAlign: "right",
    outline: "none",
  },
}));
const NavigationMenu = () => {
  const matches = useMediaQuery("(min-width:600px)");
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const { mode, setMode } = useContext(LabActionContext);

  const removeCookie = (key) => {
    const cookies = new Cookies();
    cookies.remove(key);
    setUser(null);
    setCurrentUser(null);
    setMode(null);
    navigate("/");
  };

  const logout = async () => {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}api/users/logout`,
      withCredentials: true,
    })
      .then((res) => {
        // console.log("logout response", res.data);
        removeCookie("jwt");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Menu className={classes.menu} right width={250}>
      {user && (
        <Typography variant="subtitle1" className={classes.username}>
          Welcome, {user?.username}
        </Typography>
      )}
      <Link to="/">
        <Typography className={classes.menuItem}>Home</Typography>
      </Link>

      <Divider light />
      <Link to="#">
        <Typography onClick={logout} className={classes.menuItem}>
          Logout
        </Typography>
      </Link>
      <Divider light />
    </Menu>
  );
};

export default NavigationMenu;
