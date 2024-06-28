import {useLocation, useNavigate, useParams} from "react-router-dom";

const withRouter = WrappedComponent => props => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    return <WrappedComponent {...props} {...{navigate,location,params}} />
}

export default withRouter;
