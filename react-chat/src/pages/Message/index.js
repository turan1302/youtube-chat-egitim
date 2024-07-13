import React, {Component, createRef} from 'react'
import {inject, observer} from "mobx-react";
import withRouter from "../../withRouter";
import RestClient from "../../RestAPI/RestClient";
import AppUrl from "../../RestAPI/AppUrl";
import Notification from "../../RestAPI/Notification";
import AuthLayout from "../../components/Layout/AuthLayout";
import Header from "../../components/common/Header";
import "../../css/Message.css";
import {Button, Card, Col, Container, FormControl, InputGroup, Row} from "react-bootstrap";
import SocketIO from "socket.io-client";
import {CircleSpinner} from "react-spinners-kit";
import {Helmet} from "react-helmet";

class Message extends Component {
    constructor(props) {
        super(props);

        const {user} = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState : false;
        const {params} = this.props;


        this.state = {
            receiver_info: {},
            isLoading : true,
            form: {
                sender_id : parseInt(user.id),
                receiver_id: parseInt(params.id),
                message_id: '',
                message: '',
            },
            messages: []
        }

        this.chatContainerRef = createRef();
    }

    componentDidMount() {
        this.searchReceiver();
        this.connectSocket();
    }

    connectSocket = () => {
        this.socket = SocketIO("http://localhost:4444", {transports: ['websocket', 'polling', 'flashsocket']});
        this.socket.on("send_message", (data) => {
            this.messageRender();
        });
    }

    messageRender = () => {
        this.socket.on("message_show", (data) => {
            const {messages} = this.state;

            console.log(data);
            let newMessages = [...messages, {
                "mgc_sender": data.mgc_sender,
                "mgc_content": data.mgc_content
            }];

            this.setState({
                messages: newMessages,
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.chatContainerRef.current) {
            this.chatContainerRef.current.scrollTop = this.chatContainerRef.current.scrollHeight;
        }
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }


    handleMessage = (event) => {
        let newForm = {
            ...this.state.form,
            message: event.target.value
        }

        this.setState({form: newForm});
    }

    sendMessage = () => {
        const token = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState.user.access_token : null;

        RestClient.postRequest(AppUrl.send_message, this.state.form, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((res) => {
            const result = res.data;

            if (result.success === true) {
                const {form, messages} = this.state;
                let newMessages = [...messages, {
                    "mgc_sender": form.sender_id,
                    "mgc_content": form.message
                }];


                this.setState({
                    messages: newMessages,
                }, () => {

                    let newForm = {
                        ...this.state.form,
                        message: ''
                    }

                    this.setState({form: newForm});
                    this.messageRender();
                });

            } else {
                console.log(result);
                Notification.error(result);
            }

        }).catch((err) => {
            console.log(err);
            Notification.error({
                title: "Hata",
                message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz..."
            })
        });
    }

    searchReceiver = () => {
        const {navigate, params} = this.props;
        this.props.AuthStore.getToken();
        const token = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState.user.access_token : null;

        RestClient.postRequest(AppUrl.search_receiver, {
            receiver_id: parseInt(params.id)
        }, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((res) => {
            const result = res.data;

            if (result.success === false) {
                Notification.error(result);
                navigate("/");
            } else {
                const newForm = {
                    ...this.state.form,
                    message_id: result.data.message_id
                }

                this.setState({
                    isLoading : false,
                    receiver_info: result.data.receiver_info,
                    form: newForm
                }, () => {

                    // SOCKET KISMINDA KULLANICILAR DIZISINE KAYDEDELİM
                    this.socket.emit("add_user", {
                        "sender_id": this.state.form.sender_id,
                        "message_id": this.state.form.message_id
                    });

                    this.getMessages();
                    this.messageRead(this.state.form.message_id);
                });
            }
        }).catch((err) => {
            console.log(err);
            Notification.error({
                title: "Hata",
                message: "Bir hata oluştu. LÜtfen daha sonra tekrar deneyiniz"
            });
            navigate("/");
        })
    }

    getMessages = () => {
        const token = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState.user.access_token : null;


        RestClient.postRequest(AppUrl.get_messages, {
            "mgc_messageId": this.state.form.message_id
        }, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((res) => {
            const result = res.data;
            this.setState({
                messages: result.data.messages
            });

        }).catch((err) => {
            console.log(err);
            Notification.error({
                title: "Hata",
                message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz..."
            })
        });
    }

    /** OKUNDU AYARLAMASI **/
    messageRead = (message_id) => {
        const token = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState.user.access_token : null;
        const {user} = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState : false;


        setInterval(async function () {
            RestClient.postRequest(AppUrl.update_read, {
                "mgc_messageId": message_id,
                "mgc_receiver": user.id
            }, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then((res) => {

            }).catch((err) => {
            });
        }, 3000);
    }

    render() {
        const {user} = (this.props.AuthStore.appState !== null) ? this.props.AuthStore.appState : false;
        const {receiver_info,messages,form,isLoading} = this.state;

        if (isLoading) {
            return (
                <div className={"d-flex justify-content-center align-items-center vh-100"}>
                    <CircleSpinner size={30} color="#686769" loading={isLoading} />
                </div>
            )
        }

        return (
            <AuthLayout>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Alıcı: '{receiver_info.name}' | mChat</title>
                </Helmet>

                <Header/>

                <Container className={"mt-5"}>
                    <main className="content">
                        <Container className="p-0">

                            <h1 className="h3 mb-3">'{receiver_info.name}' ile Sohbet Ediyorsunuz</h1>

                            <Card>
                                <Row className="g-0">
                                    <Col xs={12} lg={12} xl={12}>
                                        <div className="py-2 px-4 border-bottom d-none d-lg-block">
                                            <div className="d-flex align-items-center py-1">
                                                <div className="flex-grow-1 pl-3">
                                                    <strong>{receiver_info.name}</strong>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="position-relative p-3">
                                            <div className="chat-messages" ref={this.chatContainerRef}>

                                                {messages.map((item, index) => (
                                                    <div key={index} style={{marginBottom: '2rem', marginTop: '2rem'}}
                                                         className={`mesajBlok ${(item.mgc_sender === user.id) ? 'chat-message-right' : 'chat-message-left'}`}>
                                                        <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                                            {item.mgc_content}
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>

                                        <div className="flex-grow-0 py-3 px-4 border-top">
                                            <InputGroup>
                                                <FormControl value={form.message} onChange={this.handleMessage}
                                                             type="text" placeholder="Mesajınız"/>
                                                <Button onClick={this.sendMessage} disabled={form.message === ''}
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
