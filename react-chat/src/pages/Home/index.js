import {Component} from "react";
import Header from "../../components/common/Header";
import withRouter from "../../withRouter";
import {inject, observer} from "mobx-react";
import AuthLayout from "../../components/Layout/AuthLayout";
import {Badge, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {Pagination} from 'react-laravel-paginex';
import RestClient from "../../RestAPI/RestClient";
import AppUrl from "../../RestAPI/AppUrl";
import Notification from "../../RestAPI/Notification";
import {Link} from "react-router-dom";
import SocketIO from 'socket.io-client';

class Home extends Component {

    constructor(props) {
        super(props);

        this.socket = SocketIO("http://localhost:4444", {transports: ['websocket', 'polling', 'flashsocket']});

        this.state = {
            isLoading: true,
            clients: []
        }
    }

    componentDidMount() {
        this.connectUser();
        this.getClients();

        this.connectUser = this.connectUser.bind(this);
    }

    connectUser = ()=>{
        this.props.AuthStore.getToken();
        const {user} = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState : null;

        this.socket.emit("connect_user",{
            userId : user.id
        });
    }

    getClients = (data = "") => {
        this.props.AuthStore.getToken();
        const token = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState.user.access_token : null;
        const page = (data === "") ? 1 : data.page;

        RestClient.getRequest(AppUrl.home+`?page=${page}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((res) => {
            const result = res.data;
            const status = res.status;
            if (status === 200) {
                this.setState({
                    isLoading: false,
                    clients: result.data
                })
            }
        }).catch((err) => {
            console.log(err);
            Notification.error({
                title: "Hata",
                message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz"
            })
        })
    }

    clientRender = (clients)=>{
        return clients.data.map((item,index)=>{
            return (
                <ListGroup.Item as={Link} to={`/message/${item.id}`} key={index} className={"d-flex justify-content-between"}>{item.name}
                    <Badge pill bg={"success"} className={"text-white"}>{item.dont_read}</Badge>
                </ListGroup.Item>
            )
        })
    }

    render() {
        const {isLoading, clients} = this.state;

        if (isLoading) {
            return (
                <div className={"d-flex justify-content-center align-items-center vh-100"}>
                    Yükleniyor...
                </div>
            )
        }

        return (
            <AuthLayout>
                <Header/>

                <Container className={"mt-5"}>
                    <Row className={"my-3"}>
                        <Col md={12}>
                            <Card>
                                <Card.Header>Kullanıcılar</Card.Header>
                                <Card.Body>
                                    <ListGroup>
                                        {(clients.data.length>0) ? this.clientRender(clients) : (
                                            <div className={"alert alert-danger text-center"}>
                                                Herhangi bir kullanıcı bulunamadı
                                            </div>
                                        )}

                                    </ListGroup>

                                    {(clients.data.length>=10) &&
                                    <div className={"mt-3"}>
                                        <Pagination changePage={this.getClients} data={clients}/>
                                    </div>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </AuthLayout>
        )
    }
}

export default withRouter(inject("AuthStore")(observer(Home)));
