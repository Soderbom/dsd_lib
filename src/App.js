import {
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate
} from "react-router-dom";
import React, {Fragment, useState, useEffect} from "react";

import Warehouse from "./components/Warehouse";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  function isAuth() {

    // TODO Skapa en riktigt inloggning
    setAuth(true);
  }

  useEffect(() => {
    isAuth();
  },[])

  return (
    <Fragment>
      <Router>
        <div>
        <Routes>
        <Route path="/" element={isAuthenticated ? (<Warehouse setAuth={setAuth} />) : (<Navigate replace to="/login" />)}/>
          <Route path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} />) : (<Navigate replace to="/warehouse" />)} />
          <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth} /> : (<Navigate replace to="/warehouse" />)}/>
          <Route path="/warehouse" element={isAuthenticated ? (<Warehouse setAuth={setAuth} />) : (<Navigate replace to="/login" />)}/>
        </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
