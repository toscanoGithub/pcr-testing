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

// green #249f9c   red #E44C9E    white #E8E9EB

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "20vh",
    height: "300px",
    display: "grid",
    placeItems: "center",
    width: "90%",
    maxWidth: 400,
    margin: "0 auto",
    backgroundColor: "#249f9c",
    borderRadius: 20,
    boxShadow: "0px 5px 10px 0px #444 !important",
  },
  form: {
    width: "100%",
    "&>h3": {
      textAlign: "center",
      fontWeight: 700,
      color: "#E8E9EB",
    },
  },
  formHeader: {
    alignSelf: "flex-end",
    fontSize: 40,
    fontWeight: 700,
    color: "#fff",
  },

  errors: {
    padding: 3,
    backgroundColor: "#23C2E3",
    color: "white",
    width: "100%",
    textAlign: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  alreadyText: {
    textDecoration: "none",
    color: "#E8E9EB",
    margin: 10,
    "&:hover": {
      opacity: 0.8,
    },
  },

  btnSubmit: {
    backgroundColor: "#E44C9E",
    color: "#E8E9EB",
    padding: 0,
    height: 40,
    transition: "all 1s ease",
    marginTop: 20,
    marginBottom: 5,
    border: "none",
    "&>:hover": {
      backgroundColor: "#E44C9E",
      padding: 0,
      height: 40,
      opacity: 0.8,
    },
  },

  alreadyUserWrapper: {
    display: "flex",
    alignItems: "center",
    "&>a": {
      color: "white",
      fontWeight: 700,
      letterSpacing: 1,
      textDecoration: "underline",
      color: "#E44C9E",
    },
  },
}));
const Signin = () => {
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
                });
                navigate("/citizen");
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
                <Typography variant="h3">Login</Typography>
                <div className={classes.inputs}>
                  <TextInput
                    placeholder="johndoe_91"
                    label="Username"
                    name="username"
                    type="text"
                    emoji=""
                  />

                  <TextInput
                    placeholder="Choose Password"
                    label="Password"
                    name="password"
                    type="password"
                    emoji=""
                  />

                  <Button
                    className={classes.btnSubmit}
                    fullWidth
                    type="submit"
                    fullWidth
                    variant="contained"
                  >
                    Login
                  </Button>
                </div>
                <div className={classes.alreadyUserWrapper}>
                  <Typography
                    className={classes.alreadyText}
                    variant="subtitle1"
                  >
                    Not registred yet?
                  </Typography>
                  <Typography variant="subtitle1" component={Link} to="/signup">
                    Sign up
                  </Typography>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default Signin;
