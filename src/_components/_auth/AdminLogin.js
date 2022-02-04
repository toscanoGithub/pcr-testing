import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import TextInput from "./TextInput";

import * as Yup from "yup";
import { Button, makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

import Spinner from "../Spinner";

// "#90DFF1", #666885 white #E8E9EB

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 300,
    padding: 0,
    marginTop: "20vh",
    display: "grid",
    placeItems: "center",
    width: "90%",
    maxWidth: 400,
    margin: "0 auto",
    backgroundColor: "#666885",
    borderRadius: 20,
    boxShadow: "0px 5px 10px 0px #444 !important",
    position: "relative",
    overflow: "hidden",
  },
  form: {
    width: "100%",
    "&>h3": {
      textAlign: "center",
      fontWeight: 700,
      color: "#E8E9EB",
      fontSize: 30,
      marginTop: -30,
      marginBottom: 30,
    },
  },
  formHeader: {
    alignSelf: "flex-end",
  },

  errors: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 8,
    backgroundColor: "#23C2E3",
    color: "white",
    width: "100%",
    textAlign: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 60,
  },

  btnSubmit: {
    padding: 0,
    height: 50,
    transition: "all 1s ease",
    marginTop: 20,
    marginBottom: 5,
    border: "none",
    color: "#E8E9EB",
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: "capitalize",
    position: "absolute",
    bottom: -8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTop: "1px solid #6D6D8F",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset !important",
  },
}));
const AdminLogin = () => {
  const navigate = useNavigate();

  const [showSpinner, setShowSpinner] = useState(false);
  const [errors, setErrors] = useState(null);
  const [state, setState] = useState({
    registered: true,
  });

  const handleChange = (event) => {
    setState((previous) => {
      return { ...previous, registered: !previous.registered };
    });
  };

  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const validate = Yup.object({
    username: Yup.string().required("Required"),

    password: Yup.string()
      .min(5, "Must be at least 5 characters")
      .required("Password is required"),
  });

  return (
    <>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={validate}
        onSubmit={async (values, formik) => {
          console.log(values);
          // setShowSpinner(true);
          axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/users/login`,
            withCredentials: true,
            data: {
              ...values,
            },
          })
            .then((res) => {
              if (res.data.errors) {
                setErrors(res.data.errors);
                console.log(res.data.errors);
                setShowSpinner(false);
                setTimeout(() => {
                  setErrors(null);
                }, 1000);
              } else {
                formik.resetForm();
                // setShowSpinner(false);
                console.log("signin ------ >", res.data, user);
                setUser({
                  ...user,
                  ...res.data,
                  isAdmin: res.data.isAdmin,
                  logo: res.data.logo,
                });
                if (res.data.isAdmin === "true") {
                  navigate("/admin");
                } else {
                  // logout
                  axios({
                    method: "post",
                    url: `${process.env.REACT_APP_API_URL}api/users/logout`,
                    withCredentials: true,
                  })
                    .then((res) => {
                      setErrors({
                        error: "No admin with the provided credentials",
                      });
                      setTimeout(() => {
                        setErrors(null);
                        navigate("/");
                      }, 1500);
                    })
                    .catch((err) => console.log("Something went wrong"));
                }
              }
            })
            .catch((err) => {
              // setShowSpinner(false);
              console.log("error on sign in >>>", err.message);
            });
        }}
      >
        {(formik) => {
          return (
            <div className={classes.root}>
              <Spinner loading={showSpinner} />

              {errors && (
                <Typography variant="subtitle1" className={classes.errors}>
                  {errors.error || errors.username || errors.password}
                </Typography>
              )}
              <Form className={classes.form}>
                <Typography variant="h3">Admin Login</Typography>
                <div className={classes.inputs}>
                  <TextInput
                    placeholder="johndoe_91"
                    label="Username. EX. dynacare"
                    name="username"
                    type="text"
                    emoji=""
                  />

                  <TextInput
                    placeholder="Choose Password"
                    label="Password. EX. dynacare"
                    name="password"
                    type="password"
                    emoji=""
                  />

                  <Button
                    className={classes.btnSubmit}
                    fullWidth
                    type="submit"
                    variant="outlined"
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default AdminLogin;
