import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Divider, makeStyles, Typography } from "@material-ui/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Customer from "../_customers/Customer";
import LabActionContext from "../../context/LabActionContext";
import AddCustomerForm from "./AddCustomerForm";
import Header from "../Header";

const useStyles = new makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100vh",
    display: "grid",
    placeItems: "center",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },

  logo: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  header: {
    textTransform: "capitalize",
    fontSize: "calc(8px + 3vh)",
    fontWeight: 900,
    textTransform: "capitalize",
    textAlign: "center",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#53DCFD90",
    maxWidth: 250,
    justifyContent: "space-between",
    borderRadius: 20,
    margin: "0 auto",
    marginTop: 30,

    "&>input[type='text']": {
      border: "none",
      backgroundColor: "transparent",
      flex: 1,
      outline: "none",
      padding: 10,
      color: "#666885",
    },

    "&>svg": {
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      color: "#fff",
      fontSize: 40,
      padding: 10,
      backgroundColor: "#666885",
      height: "100%",
      cursor: "pointer",
      transition: "all 200ms ease",
      "&:hover": {
        opacity: 0.8,
        // backgroundColor: "#fff",
        // color: "black",
      },
    },
  },

  newCustomerText: {
    zIndex: 10,
  },

  addButtonWrapper: {
    width: "100%",
    display: "grid",
    placeItems: "center",
    maxWidth: 250,
    margin: "0.7rem auto",
    position: "relative",
    "&>button": {
      width: "100%",
      borderRadius: 15,
      backgroundColor: "#EDEDED",
      color: "#000",
    },
  },

  main: {
    width: "100%",
    display: "grid",
    placeItems: "center",
  },

  nothingToShow: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 20,
  },
}));
const Admin = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { mode, setMode } = useContext(LabActionContext);
  const [searchTerm, setSearchTerm] = useState(null);
  const [customer, setCustomer] = useState();
  const searchRef = useRef();

  useEffect(() => {
    (async function () {
      setMode(null);
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}user`,
        withCredentials: true,
      })
        .then((res) => {
          if (!res.data?.username || res.data.isAdmin === "false") {
            navigate("/admin/login");
          } else {
            setUser({ ...res.data });
          }
        })
        .catch((err) => {
          navigate("/");
        });
    })();
  }, []);

  const display = () => {
    switch (mode) {
      case "search":
        return <Customer {...customer} />;
      case "add":
        return (
          <Typography>
            <AddCustomerForm />
          </Typography>
        );
      case "not found":
        return (
          <Typography className={classes.nothingToShow} variant="body1">
            No customer with {searchRef.current.value} CIN or passport number
          </Typography>
        );
      default:
        break;
    }
  };

  const handleSearchChangeInput = (e) => {
    if (e.target.value !== "") {
      setMode("editing");
    } else {
      setMode(null);
      setCustomer(null);
    }
    setSearchTerm(e.target.value);
  };

  const handleSearchBtnClicked = async () => {
    if (searchRef.current.value === "") return;
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}api/users/${searchTerm}`,
      withCredentials: true,
    })
      .then((res) => {
        // console.log(res.data);
        if (!res.data.customer) {
          setMode("not found");
          setTimeout(() => {
            setMode(null);
            searchRef.current.value = "";
          }, 2000);
          return;
        }
        setCustomer(res.data.customer);
        setMode("search");
      })
      .catch((err) => {
        console.log(err);
      });

    searchRef.current.value = "";
  };
  return (
    <div className={classes.root}>
      {user?.username ? (
        <div>
          {user && <Header />}

          <div className={classes.searchBox}>
            <input
              ref={searchRef}
              onChange={handleSearchChangeInput}
              type="text"
              placeholder="CIN or Passport number"
            />
            <SearchIcon onClick={handleSearchBtnClicked} />
          </div>
          <div className={classes.addButtonWrapper}>
            <Button
              disabled={mode === "editing" || mode === "search"}
              onClick={() => setMode("add")}
              variant="outlined"
            >
              Add new customer
            </Button>
          </div>

          <Divider light style={{ margin: "2rem auto", maxWidth: "500px" }} />

          {/* ----------------------------------- MAIN -------------------------------------- */}
          <div className={classes.main}>{display()}</div>
        </div>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </div>
  );
};

export default Admin;
