import React, { useEffect } from "react";
import { useField, ErrorMessage } from "formik";
import { Divider, makeStyles } from "@material-ui/core";
import { TextField } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  inputErrorWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },

  errorMessage: {
    color: "#DE404F",
    width: "100%",
    padding: 3,
    fontSize: "0.7rem",
    textAlign: "center",
  },
}));
const TextInput = ({ label, ...props }) => {
  const classes = useStyles();
  const [field, meta] = useField(props);

  useEffect(() => {
    console.log("props >>>>", props);
  }, []);
  return (
    <div className={classes.textInput}>
      <div className={classes.inputErrorWrapper}>
        <TextField
          className={classes.field}
          value={props.value}
          fullWidth
          {...field}
          {...props}
          placeholder={`${props.emoji} ${label}`}
          autoComplete="off"
          InputProps={{
            disableUnderline: true,
            style: {
              paddingLeft: 8,
              backgroundColor: `${props.bg || "transparent"}`,
              borderBottom: "1px solid #F1F3F470",
              color: `${props.color || "white"}`,
            },
          }}
        />

        <div className={classes.errorMessage}>
          <ErrorMessage name={field.name} />
        </div>
      </div>
    </div>
  );
};

export default TextInput;
