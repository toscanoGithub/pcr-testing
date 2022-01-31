import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import LabActionContext from "../../context/LabActionContext";

const useStyles = new makeStyles((theme) => ({
  root: {},

  profile: {
    width: 250,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  row: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  label: {
    fontWeight: 900,
    fontSize: 14,
  },
}));
const Customer = ({ _id, username, cin, passportNumber, lab, results }) => {
  const classes = useStyles();

  const [open, setOpen] = useState();
  const [result, setResult] = useState({ result: "Pending" });
  const [testedCustomer, setTestedCustomer] = useState();
  const { mode, setMode } = useContext(LabActionContext);

  useEffect(() => {
    setTestedCustomer({
      username,
      cin,
      passportNumber,
      lab,
      results,
    });
  }, []);

  const handleChange = (event) => {
    setResult({ result: event.target.value, time: Date.now() });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const editTestResult = () => {
    const testedCustomer = {
      username,
      cin,
      passportNumber,
      lab,
      results: [...results, result],
    };
    console.log(testedCustomer, _id);

    axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/users/results/${_id}`,
      withCredentials: true,
      data: result,
    })
      .then((res) => {
        console.log("result", result);
        setTestedCustomer(null);
        setMode(null);
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.profile}>
        <div className={classes.row}>
          <Typography className={classes.label}> Full name</Typography>
          <Typography variant="subtitle1"> {username}</Typography>
        </div>
        <Divider light />
        {cin && (
          <div className={classes.row}>
            <Typography className={classes.label}>CIN</Typography>
            <Typography variant="subtitle1"> {cin}</Typography>
          </div>
        )}
        <Divider light />
        {passportNumber && (
          <div className={classes.row}>
            <Typography className={classes.label}>Passport number</Typography>
            <Typography variant="subtitle1"> {passportNumber}</Typography>
          </div>
        )}
        {passportNumber && <Divider light />}
        <div className={classes.row}>
          <Typography className={classes.label}>Laboratory name</Typography>
          <Typography variant="subtitle1"> {lab}</Typography>
        </div>
        {results[0] && <Divider light />}

        {results[0] !== "Pending" && (
          <div className={classes.row}>
            <Typography className={classes.label}>Last test </Typography>
            <Typography variant="subtitle1">
              {results.reverse()[0].result}
            </Typography>
            <Typography variant="subtitle1">
              {new Date(results.reverse()[0].time).toLocaleDateString()}
            </Typography>
          </div>
        )}

        {mode !== "edit" && (
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">
              Test result
            </InputLabel>

            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={result.result}
              onChange={handleChange}
            >
              <MenuItem value={"Pending"}>New test</MenuItem>
              <MenuItem value={"Negative"}>Negative</MenuItem>
              <MenuItem value={"Positive"}>Positive</MenuItem>
            </Select>
          </FormControl>
        )}
      </Paper>
      <Button onClick={editTestResult} variant="outlined" fullWidth>
        Submit
      </Button>
    </div>
  );
};

export default Customer;
