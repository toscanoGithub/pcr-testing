import { makeStyles } from "@material-ui/styles";
import React from "react";
const useStyles = makeStyles((theme) => ({
  root: {},
}));
const Template = () => {
  const classes = useStyles();
  return <div className={classes.root}>Template</div>;
};

export default Template;
