import {Component} from "react";
import {Nav, Navbar} from "react-bootstrap";
import withRouter from "../../../withRouter";
import {Link} from "react-router-dom";
import {inject,observer} from "mobx-react";

class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {location} = this.props;

        return (
            <>
                <Navbar bg="dark" variant="dark"> d
                    <Navbar.Brand as={Link} to={"/"}>mChat</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link active={location.pathname==="/"} as={Link} to={"/"}>Anasayfa</Nav.Link>
                        <Nav.Link active={location.pathname==="/login"} as={Link} to={"/login"}>Giriş Yap</Nav.Link>
                        <Nav.Link active={location.pathname==="/register"} as={Link} to={"/register"}>Kayıt Ol</Nav.Link>
                    </Nav>
                </Navbar>
            </>
        )
    }
}

export default withRouter(inject("AuthStore")(observer(Header)));
