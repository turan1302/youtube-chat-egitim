import {Component} from "react";
import {inject, observer} from "mobx-react";
import withRouter from "../../withRouter";
import RestClient from "../../RestAPI/RestClient";
import AppUrl from "../../RestAPI/AppUrl";

class Logout extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
       this.doLogout();
    }

    doLogout = ()=>{
        const {navigate} = this.props;

        this.props.AuthStore.getToken();
        const token = (this.props.AuthStore.appState!==null) ? this.props.AuthStore.appState.user.access_token : null;

        RestClient.getRequest(AppUrl.logout,{
            headers : {
                "Authorization" : "Bearer "+token
            }
        }).then((res)=>{
            this.props.AuthStore.removeToken();
            navigate("/login");
        }).catch((err)=>{
            console.log(err);
        })
    }

    render() {
        return (
            <>

            </>
        )
    }
}

export default withRouter(inject("AuthStore")(observer(Logout)))
