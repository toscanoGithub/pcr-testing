import React, { useContext } from "react";
import { Button, makeStyles, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const useStyles = new makeStyles((theme) => ({
  root: {
    display: "grid",
    placeItems: "center",
    height: "100vh",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },

  main: {
    maxWidth: 400,
    width: "100%",
    padding: "30px",
  },

  header: {
    padding: 30,
    textAlign: "center",
    "&>h1": {
      fontSize: 30,
      fontWeight: 900,
    },
  },

  controls: {
    marginTop: 20,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    rowGap: 10,

    "&>button": {
      maxWidth: 400,
      color: "#F50057",
    },
  },

  filocare: {
    color: "#F50057",
  },
}));
const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <div className={classes.header}>
          <Typography variant="h1">
            Welcome to <span className={classes.filocare}>Filocare</span>
          </Typography>
        </div>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, veritatis
          maxime. Ipsa, repellat? Ipsa adipisci, quidem nesciunt illum
          accusantium vitae alias libero omnis. Amet voluptas vitae suscipit ea
          iure accusantium?
        </Typography>
        <div className={classes.controls}>
          <Button
            onClick={() => {
              setUser({ ...user, isAdmin: true });
              navigate("/admin");
            }}
            variant="outlined"
            fullWidth
          >
            I'm an Admin
          </Button>
          <Button
            onClick={() => {
              setUser({ ...user, isAdmin: false });
              navigate("/citizen");
            }}
            variant="outlined"
            fullWidth
          >
            I'm a Citizen
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Home;
