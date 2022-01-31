import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
var QRCode = require("qrcode.react");

const useStyles = new makeStyles((theme) => ({
  root: {
    height: "100vh",
    minWidth: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },

  logo: {
    position: "absolute",
    left: 5,
    top: 20,
    display: "flex",
    alignItems: "center",
    transform: "rotateZ(-20deg)",
    zoom: 0.8,
  },

  filo: {
    color: "#666885",
    fontSize: 18,
    fontWeight: 900,
    textTransform: "lowercase",
  },

  care: {
    color: "#35BC99",
    fontSize: 18,
    fontWeight: 900,
    textTransform: "uppercase",
  },

  main: {
    marginTop: "10vh",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#35BC9970",
    borderRadius: 10,
    width: "99%",
    maxWidth: 500,
    "&>h1": {
      fontSize: 20,
      fontWeight: 900,
    },
  },

  feedback: {
    justifySelf: "flex-start",
    marginTop: 70,
    color: "#fff",
    fontWeight: 700,
    backgroundColor: "#F9353F",
    padding: 20,
    borderRadius: 5,
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
        opacity: 0.9,
      },
    },
  },

  customer: {
    backgroundColor: "#35BC9970",
    padding: 10,
    margin: "40px auto",
    // width: 450,
    width: "99%",
    maxWidth: 500,
    height: "auto",
    borderRadius: 10,
  },

  profile: {
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
  },

  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    "&>img": {
      width: 70,
      objectFit: "cover",
      border: "1px solid #66688560",
      borderRadius: "50%",
    },
  },

  results: {
    "&>h6": {
      fontWeight: 900,
    },
  },

  qrCodeWrapper: {
    display: "grid",
    placeItems: "center",
    "&>button": {
      marginTop: 10,
      width: 150,
      backgroundColor: "#53DCFD90",
      borderColor: "#66688590",
      color: "#000",
      "&:hover": {
        color: "#000",
      },
    },
  },

  hr: {
    borderBottom: "1px solid #fff",
    opacity: 0.3,
  },
}));
const Citizen = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(null);
  const [customer, setCustomer] = useState();
  const [feedback, setFeedback] = useState(null);
  const searchRef = useRef();
  const [qrData, setQrData] = useState();
  const [result, setResult] = useState("Pending");

  useEffect(() => {
    setResult(customer?.results[customer?.results.length - 1]?.result);
  }, [customer]);

  // With async/await
  const generateQR = async (customer) => {
    var url = `https://chart.googleapis.com/chart?cht=qr&chs=100x100&chl=Name=${customer.username}`;

    setQrData(url);
  };

  const handleSearchChangeInput = (e) => {
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
          setFeedback({
            message: "No data matches the credentials you provided",
          });
          setTimeout(() => {
            setFeedback(null);
          }, 2000);
        } else {
          setCustomer(res.data.customer);
          console.log(`http://robohash.org/${res.data.customer.cin}`);
          generateQR(res.data.customer);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });

    searchRef.current.value = "";
  };

  function download() {
    const qrCodeURL = document
      .getElementById("QRCode")
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    console.log(qrCodeURL);
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = `QR_CODE_${customer.cin}.png`;
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  }

  return (
    <div className={classes.root}>
      <div className={classes.logo}>
        <Typography className={classes.filo} variant="h3">
          Citizen
        </Typography>
        <Typography className={classes.care} variant="h3">
          Care
        </Typography>
      </div>
      <div className={classes.main}>
        <Typography variant="h1">Welcome to Filocare</Typography>
        <Typography variant="subtitle1">
          Please provide us with your CIN or passport number.
        </Typography>
        <div className={classes.searchBox}>
          <input
            ref={searchRef}
            onChange={handleSearchChangeInput}
            type="text"
            placeholder="CIN or Passport number"
          />
          <SearchIcon onClick={handleSearchBtnClicked} />
        </div>
      </div>

      <div>
        {feedback && (
          <Typography className={classes.feedback} variant="subtitle1">
            {feedback.message}
          </Typography>
        )}
      </div>
      {customer && (
        <Paper elevation={0} className={classes.customer}>
          {customer && (
            <div className={classes.profile}>
              <div className={classes.profileHeader}>
                <img src={`http://robohash.org/${customer.cin}`} />
                <div>
                  <Typography variant="body2">{customer.username}</Typography>
                  <Typography variant="body2">{customer.cin}</Typography>
                  <Typography variant="body2">{customer.email}</Typography>
                </div>

                <div className={classes.info}>
                  <div className={classes.testedBy}>
                    <Typography variant="body2">
                      {customer.lab.toUpperCase()}
                    </Typography>
                  </div>

                  <div className={classes.testDate}>
                    <Typography variant="body2">
                      {new Date(
                        customer.results[customer.results.length - 1].time
                      ).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div className={classes.results}>
                    <Typography variant="subtitle1">
                      {customer.results[customer.results.length - 1].result}
                    </Typography>
                  </div>
                </div>
              </div>
              <hr className={classes.hr} />
              <div className={classes.qrCodeWrapper}>
                <QRCode
                  id="QRCode"
                  size={"70"}
                  value={`${process.env.REACT_APP_API_URL}api/users/qrcode/${customer.cin}?name=${customer.username}&cin=${customer.cin}&email=${customer.email}&result=${result}&lab=${customer.lab}`}
                />
                <Button download="#" onClick={download} variant="outlined">
                  Download
                </Button>
              </div>
            </div>
          )}
        </Paper>
      )}
    </div>
  );
};

export default Citizen;
