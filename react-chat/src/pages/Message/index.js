import React, {Component} from 'react'
import {inject, observer} from "mobx-react";
import withRouter from "../../withRouter";
import RestClient from "../../RestAPI/RestClient";
import AppUrl from "../../RestAPI/AppUrl";
import Notification from "../../RestAPI/Notification";
import AuthLayout from "../../components/Layout/AuthLayout";
import Header from "../../components/common/Header";
import "../../css/Message.css";
import {Button, Card, Col, Container, FormControl, InputGroup, Row} from "react-bootstrap";

class Message extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        this.searchReceiver();
    }

    searchReceiver = ()=>{
        const {navigate,params} = this.props;
        this.props.AuthStore.getToken();
        const token = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState.user.access_token : null;

        RestClient.postRequest(AppUrl.search_receiver,{
            receiver_id : parseInt(params.id)
        },{
            headers : {
                "Authorization" : "Bearer "+token
            }
        }).then((res)=>{
            const result = res.data;

            if (result.success===false){
                Notification.error(result);
                navigate("/");
            }
        }).catch((err)=>{
            console.log(err);
            Notification.error({
                title : "Hata",
                message : "Bir hata oluştu. LÜtfen daha sonra tekrar deneyiniz"
            });
            navigate("/");
        })
    }

    render() {
        return (
            <AuthLayout>
                <Header/>

                <Container className={"mt-5"}>
                    <main className="content">
                        <Container className="p-0">

                            <h1 className="h3 mb-3">'' ile Sohbet Ediyorsunuz</h1>

                            <Card>
                                <Row className="g-0">
                                    <Col xs={12} lg={12} xl={12}>
                                        <div className="py-2 px-4 border-bottom d-none d-lg-block">
                                            <div className="d-flex align-items-center py-1">
                                                <div className="flex-grow-1 pl-3">
                                                    <strong>{'alici'}</strong>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="position-relative p-3">
                                            <div className="chat-messages">


                                                <div style={{marginBottom: '2rem', marginTop: '2rem'}}
                                                     className={'mesajBlok chat-message-right'}>
                                                    <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                                        Test Mesaj
                                                    </div>
                                                </div>

                                                <div style={{marginBottom: '2rem', marginTop: '2rem'}}
                                                     className={'mesajBlok chat-message-left'}>
                                                    <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                                        Test Mesaj
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="flex-grow-0 py-3 px-4 border-top">
                                            <InputGroup>
                                                <FormControl
                                                    type="text" placeholder="Mesajınız"/>
                                                <Button
                                                    variant="primary">Gönder</Button>
                                            </InputGroup>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Container>
                    </main>
                </Container>
            </AuthLayout>
        )
    }
}

export default withRouter(inject("AuthStore")(observer(Message)));
