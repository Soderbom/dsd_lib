import {
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate
} from "react-router-dom";
import React, {Fragment, useState, useEffect} from "react";
import ip from "./misc";

import Warehouse from "./components/Warehouse";
import Shelf from "./components/Shelf";
import Login from "./components/Login";
import Register from "./components/Register";

// TODO Se över kommentarer

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
     try {
       const response = await fetch(`http://${ip}:5000/auth/is-verified`, {
         method: "GET",
         headers: {token: localStorage.token}
       });

       const parseRes = await response.json();

       parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
     } catch (err) {
       
     }
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
          <Route path="/shelf" element={isAuthenticated ? (<Shelf setAuth={setAuth} />) : (<Navigate replace to="/login" />)}/>
        </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
