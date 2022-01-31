import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import TextInput from "../_auth/TextInput";
import clsx from "clsx";
import UserContext from "../../context/UserContext";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LabActionContext from "../../context/LabActionContext";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "8px 8px",
    borderRadius: 30,
    backgroundColor: "#90DFF1",
  },

  form: {
    borderRadius: 20,
    minWidth: 400,
    "&>h3": {
      fontSize: 20,
      fontWeight: 900,
      textAlign: "center",
    },
  },

  rootRadio: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },

  icon: {
    borderRadius: "50%",
    width: 16,
    height: 16,
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },

  btnAdd: {
    color: "#666885",
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor: "#666885",
      color: "white",
    },
  },

  errors: {
    marginBottom: 3,
    // padding: 8,
    // backgroundColor: "red",
    // color: "white",
    textAlign: "center",
    color: "red",
    fontSize: 20,
    fontWeight: 900,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
}));
const AddCustomerForm = () => {
  const classes = useStyles();
  const [idTypeValue, setIdTypeValue] = useState("CIN");
  const { mode, setMode } = useContext(LabActionContext);
  const handleRadioChange = (event) => {
    setIdTypeValue(event.target.value);
  };

  const navigate = useNavigate();

  const [showSpinner, setShowSpinner] = useState(false);
  const [errors, setErrors] = useState(null);
  const [state, setState] = React.useState({
    registered: true,
  });

  const handleChange = (event) => {
    setState((previous) => {
      return { ...previous, registered: !previous.registered };
    });
  };

  useEffect(() => {}, []);

  const { user, setUser } = useContext(UserContext);
  const validate = Yup.object({
    username: Yup.string().required("Required"),

    cin: Yup.string()
      .min(5, "Must be at least 5 characters")
      .required("CIN/Passport number is Required"),

    // passportNumber: Yup.string().required("CIN/Passport number is Required"),

    email: Yup.string().email("Email is invalid").required("Required"),
  });

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          username: "",
          cin: "",
          passportNumber: "",
          email: "",
        }}
        validationSchema={validate}
        onSubmit={async (values, formik) => {
          console.log("values>>>>>", values);
          const newCustomer = {
            ...values,
            results: { result: "Pending", time: Date.now() },
            lab: user.username,
            password: values.cin,
          };

          axios({
            method: "post",
            withCredentials: true,
            url: `${process.env.REACT_APP_API_URL}api/users/add-customer`,
            data: { ...newCustomer },
          })
            .then((res) => {
              if (res.data.errors) {
                setErrors(res.data.errors);
                console.log(res.data.errors);
                setShowSpinner(false);
                setTimeout(() => {
                  setErrors(null);
                }, 2000);
              } else {
                formik.resetForm();
                // setShowSpinner(false);
                setMode(null);
              }
            })
            .catch((err) => console.log(err.message));
        }}
      >
        {(formik) => {
          return (
            <div className={classes.root}>
              {/* <Spinner loading={showSpinner} /> */}

              {errors && (
                <Typography variant="subtitle1" className={classes.errors}>
                  {errors.error ||
                    errors.username ||
                    errors.password ||
                    errors.cin ||
                    errors.email}
                </Typography>
              )}
              <Form className={classes.form}>
                <Typography variant="h3">New Customer</Typography>
                <div className={classes.inputs}>
                  <TextInput
                    color="#000"
                    bg="#DAF4FE"
                    placeholder="johndoe_91"
                    label="Username"
                    name="username"
                    type="text"
                    emoji=""
                  />

                  <FormControl component="fieldset">
                    <RadioGroup
                      defaultValue="CIN"
                      aria-label="cinpass"
                      name="cinOrPassport"
                      value={idTypeValue}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel
                        value="CIN"
                        control={<StyledRadio />}
                        label="CIN"
                      />
                      <FormControlLabel
                        value="PASSPORT"
                        control={<StyledRadio />}
                        label="Passport number"
                      />
                    </RadioGroup>
                  </FormControl>

                  {idTypeValue === "PASSPORT" ? (
                    <TextInput
                      color="#000"
                      bg="#DAF4FE"
                      placeholder="Passport number"
                      label="Passport number"
                      name="cin"
                      type="text"
                      emoji=""
                    />
                  ) : (
                    <TextInput
                      color="#000"
                      bg="#DAF4FE"
                      placeholder="CIN"
                      label="CIN"
                      name="cin"
                      type="text"
                      emoji=""
                    />
                  )}

                  {/* -------------------------- */}
                  <TextInput
                    color="#000"
                    bg="#DAF4FE"
                    placeholder="Enter Email"
                    label="Email"
                    name="email"
                    type="email"
                    emoji=""
                  />

                  <Button
                    className={classes.btnAdd}
                    fullWidth
                    type="submit"
                    fullWidth
                    variant="outlined"
                  >
                    Add
                  </Button>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddCustomerForm;

function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.rootRadio}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}
