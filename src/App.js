import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Home from "./_components/Home";
import { Routes, Route } from "react-router-dom";
import Signin from "./_components/_auth/Signin";
import Signup from "./_components/_auth/Signup";
import Admin from "./_components/admin/Admin";
import Citizen from "./_components/citizen/Citizen";
import UserContext from "./context/UserContext";
import AdminLogin from "./_components/_auth/AdminLogin";
import LabActionContext from "./context/LabActionContext";

const useStyles = new makeStyles((theme) => ({}));
const App = () => {
  const classes = useStyles();
  const [user, setUser] = useState();
  const [mode, setMode] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <LabActionContext.Provider value={{ mode, setMode }}>
        <div className={classes.root}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/citizen" element={<Citizen />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </LabActionContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
