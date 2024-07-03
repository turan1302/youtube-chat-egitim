import {Component} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Logout from "../pages/Logout";

class AppRouter extends Component{
    render() {
      return (
      <Routes>
          <Route path={"/"} element={<Home/>}></Route>
          <Route path={"/login"} element={<Login/>}></Route>
          <Route path={"/register"} element={<Register/>}></Route>
          <Route path={"/logout"} element={<Logout/>}></Route>
          <Route path={"*"} element={<Navigate to={"/"}/>}></Route>
      </Routes>
      )
    }
}

export default AppRouter;
