import {Component} from "react";
import {inject, observer} from "mobx-react";
import withRouter from "../../withRouter";
import RestClient from "../../RestAPI/RestClient";
import AppUrl from "../../RestAPI/AppUrl";
import {Helmet} from "react-helmet";

class Logout extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.doLogout();
    }

    doLogout = () => {
        const {navigate} = this.props;

        this.props.AuthStore.getToken();
        const token = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState.user.access_token : null;

        RestClient.getRequest(AppUrl.logout, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((res) => {
            this.props.AuthStore.removeToken();
            navigate("/login");
        }).catch((err) => {
            console.log(err);
        })
    }

    render() {
        return (
            <>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Çıkış Yap | mChat</title>
                </Helmet>
            </>
        )
    }
}

export default withRouter(inject("AuthStore")(observer(Logout)));
