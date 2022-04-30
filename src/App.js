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

// TODO Se över kommentarer

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  function isAuth() {
    // TODO Skapa en riktigt inloggning
    setAuth(false);
  }

  useEffect(() => {
    isAuth();
  },[])

  return (
    <Fragment>
      <Router>
        <div>
        <Routes>
          {/*Tillfällig logik för att kunna nå alla sidor oavsett*/}
          <Route path="/" element={<Warehouse setAuth={setAuth} />}/>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/register" element={<Register setAuth={setAuth} /> }/>
          <Route path="/warehouse" element={<Warehouse setAuth={setAuth} />}/>

          {/* <Route path="/" element={isAuthenticated ? (<Warehouse setAuth={setAuth} />) : (<Navigate replace to="/login" />)}/>
          <Route path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} />) : (<Navigate replace to="/warehouse" />)} />
          <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth} /> : (<Navigate replace to="/warehouse" />)}/>
          <Route path="/warehouse" element={isAuthenticated ? (<Warehouse setAuth={setAuth} />) : (<Navigate replace to="/login" />)}/> */}
        </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
