import {Component} from "react";
import Header from "../../components/common/Header";
import withRouter from "../../withRouter";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {inject, observer} from "mobx-react";

class Register extends Component {
    render() {
        return (
            <>
                <Header/>

                <Container>
                    <Row className={"d-flex justify-content-center mt-5"}>
                        <Col md={10}>
                            <Card>
                                <Card.Header>Kayıt Ol</Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Adınız Soyadınız</Form.Label>
                                            <Form.Control type="text" placeholder="Adınız Soyadınız" />
                                        </Form.Group>

                                        <Form.Group className={"mt-3"}>
                                            <Form.Label>E-Mail Adresiniz</Form.Label>
                                            <Form.Control type="text" placeholder="E-Mail Adresiniz" />
                                        </Form.Group>

                                        <Form.Group className={"mt-3"}>
                                            <Form.Label>Şifreniz</Form.Label>
                                            <Form.Control type="password" placeholder="Şifreniz" />
                                        </Form.Group>

                                        <Form.Group className={"mt-3"}>
                                            <Form.Label>Şifreniz (Tekrar)</Form.Label>
                                            <Form.Control type="password" placeholder="Şifreniz (Tekrar)" />
                                        </Form.Group>

                                        <Button className={"mt-3"} variant="primary" type="button">
                                            Kayıt Ol
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default withRouter(inject("AuthStore")(observer(Register)));
