import {Component} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "../pages/Home";
import Logout from "../pages/Logout";
import {inject, observer} from "mobx-react";
import withRouter from "../withRouter";
import Message from "../pages/Message";

class AuthRouter extends Component {

    render() {
        return (
            <Routes>
                <Route path={"/"} element={<Home/>}></Route>
                <Route path={"/message/:id"} element={<Message/>}></Route>
                <Route path={"/logout"} element={<Logout/>}></Route>
                <Route path={"*"} element={<Navigate to={"/"}/>}></Route>
            </Routes>
        )
    }
}

export default withRouter(inject("AuthStore")(observer(AuthRouter)));
