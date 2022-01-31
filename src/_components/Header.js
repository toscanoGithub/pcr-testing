import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import NavigationMenu from "../_components/NavigationMenu";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import UserContext from "../context/UserContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    position: "absolute",
    top: 0,
    left: 0,
  },
  header: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: 10,
  },

  logo: {
    maxWidth: 100,
  },

  links: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 5,
    "&>a": {
      color: "red",
      transition: "all 0.25s ease",
      textDecoration: "none",
      "&:hover": {
        transform: "scale(1.1)",
      },
    },
    "&>button": {
      border: "none",
      //   fontSize: 12,
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));
function Header() {
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const removeCookie = (key) => {
    const cookies = new Cookies();
    cookies.remove(key);
    setUser(null);
    setCurrentUser(null);
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
    <div className={classes.root}>
      <div className={classes.header}>
        <img src={user.logo} alt="logo" className={classes.logo} />
        <div className={classes.links}>
          <Link className={classes.homeLink} to="/">
            <Typography variant="subtitle1">Home</Typography>
          </Link>
          <Button
            variant="outlined"
            onClick={logout}
            className={classes.logout}
          >
            Logout
          </Button>
        </div>
        <NavigationMenu className={classes.navMenu}></NavigationMenu>
      </div>
    </div>
  );
}

export default Header;
