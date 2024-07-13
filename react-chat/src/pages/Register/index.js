import {Component} from "react";
import Header from "../../components/common/Header";
import withRouter from "../../withRouter";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {Formik} from "formik";
import * as Yup from "yup";
import RestClient from "../../RestAPI/RestClient";
import AppUrl from "../../RestAPI/AppUrl";
import Notification from "../../RestAPI/Notification";
import {Helmet} from "react-helmet";

class Register extends Component {

    constructor(props) {
        super(props);
    }

    handleSubmit = (values, {resetForm, setSubmitting}) => {
        const {navigate} = this.props;

        RestClient.postRequest(AppUrl.register,values).then((res)=>{
            const status = res.status;
            const result = res.data;

            if (status===201){
                resetForm();
                setSubmitting(false);
                Notification.success(result);
                navigate("/login");
            }else{
                if (status===422){
                    setSubmitting(false);
                    Notification.error(result);
                }else{
                    setSubmitting(false);
                    Notification.error(result);
                }
            }
        }).catch((err)=>{
            console.log(err);
            Notification.error({
                title : "Hata",
                message : "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz"
            });
        })
    }

    render() {
        return (
            <>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Kayıt Ol | mChat</title>
                </Helmet>

                <Header/>

                <Container>
                    <Row className={"d-flex justify-content-center mt-5"}>
                        <Col md={10}>
                            <Card>
                                <Card.Header>Kayıt Ol</Card.Header>
                                <Card.Body>
                                    <Formik initialValues={{
                                        name: '',
                                        email: '',
                                        password: '',
                                        password_confirmation: '',
                                    }}
                                            validationSchema={Yup.object().shape({
                                                name: Yup.string().required("Ad Soyad alanı gereklidir"),
                                                email: Yup.string().required("E-Mail alanı gereklidir").email("Lütfen geçerli bir E-Mail adresi giriniz"),
                                                password: Yup.string().required("Şifre alanı gereklidir").min(8, "Şifreniz en az 8 karakter olmak zorundadır").max(16, "Şifreniz en fazla 16 karakter olmak zorundadır"),
                                                password_confirmation: Yup.string().required("Şifre Tekrar alanı gereklidir").min(8, "Şifreniz en az 8 karakter olmak zorundadır").max(16, "Şifreniz en fazla 16 karakter olmak zorundadır").oneOf([Yup.ref('password'), null], "Şifreler uyuşmuyor")
                                            })}
                                            onSubmit={this.handleSubmit}>
                                        {({values,touched,errors,handleChange,handleSubmit,handleBlur,isValid,isSubmitting}) => (
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label>Adınız Soyadınız</Form.Label>
                                                    <Form.Control value={values.name} name={"name"} onChange={handleChange('name')} onBlur={handleBlur} type="text" placeholder="Adınız Soyadınız"/>
                                                    {(errors.name && touched.name) && <small style={{color : "red"}}>{errors.name}</small>}
                                                </Form.Group>

                                                <Form.Group className={"mt-3"}>
                                                    <Form.Label>E-Mail Adresiniz</Form.Label>
                                                    <Form.Control value={values.email} name={"email"} onChange={handleChange('email')} onBlur={handleBlur} type="text" placeholder="E-Mail Adresiniz"/>
                                                    {(errors.email && touched.email) && <small style={{color : "red"}}>{errors.email}</small>}
                                                </Form.Group>

                                                <Form.Group className={"mt-3"}>
                                                    <Form.Label>Şifreniz</Form.Label>
                                                    <Form.Control value={values.password} name={"password"} onChange={handleChange('password')} onBlur={handleBlur} type="password" placeholder="Şifreniz"/>
                                                    {(errors.password && touched.password) && <small style={{color : "red"}}>{errors.password}</small>}
                                                </Form.Group>

                                                <Form.Group className={"mt-3"}>
                                                    <Form.Label>Şifreniz (Tekrar)</Form.Label>
                                                    <Form.Control value={values.password_confirmation} name={"password_confirmation"} onChange={handleChange('password_confirmation')} onBlur={handleBlur} type="password" placeholder="Şifreniz (Tekrar)"/>
                                                    {(errors.password_confirmation && touched.password_confirmation) && <small style={{color : "red"}}>{errors.password_confirmation}</small>}
                                                </Form.Group>

                                                <Button disabled={(!isValid || isSubmitting)} onClick={handleSubmit} className={"mt-3"} variant="primary" type="button">
                                                    Kayıt Ol
                                                </Button>
                                            </Form>
                                        )}
                                    </Formik>

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
