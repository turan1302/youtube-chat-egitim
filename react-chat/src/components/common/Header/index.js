import {Component} from "react";
import {Nav, Navbar} from "react-bootstrap";
import withRouter from "../../../withRouter";
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import RestClient from "../../../RestAPI/RestClient";
import AppUrl from "../../../RestAPI/AppUrl";

class Header extends Component {

    constructor(props) {
        super(props);

        this.isLoggedIn();
    }

    isLoggedIn = async () => {
        this.props.AuthStore.getToken();
        const token = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState.user.access_token : null;

        await RestClient.getRequest(AppUrl.check, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((res) => {
            const result = res.data;
            if (result.isLoggedIn !== true) {
                this.props.AuthStore.removeToken();
            } else {
                let userData = {
                    id: result.data.id,
                    name: result.data.name,
                    email: result.data.email,
                    access_token: result.data.access_token
                }

                let appState = {
                    isLoggedIn: true,
                    user: userData
                }

                this.props.AuthStore.saveToken(appState);
            }
        }).catch((err) => {
            console.log(err);
            this.props.AuthStore.removeToken();
        })
    }

    render() {
        const {location} = this.props;
        const {isLoggedIn, user} = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState : {}

        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand as={Link} to={"/"}>mChat</Navbar.Brand>
                    <Nav className="mr-auto">

                        {(isLoggedIn) ? (
                            <>
                                <Navbar style={{color : "#ccc",textDecoration : "none"}} as={Link} to={"/"}>Kullanıcı: {user.name}</Navbar>
                                <Nav.Link active={location.pathname === "/logout"} as={Link} to={"/logout"}>Çıkış Yap</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link active={location.pathname === "/login"} as={Link} to={"/login"}>Giriş
                                    Yap</Nav.Link>
                                <Nav.Link active={location.pathname === "/register"} as={Link} to={"/register"}>Kayıt
                                    Ol</Nav.Link>
                            </>
                        )}

                    </Nav>
                </Navbar>
            </>
        )
    }
}

export default withRouter(inject("AuthStore")(observer(Header)));
