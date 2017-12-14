import React, { Component } from 'react';
import { Card, Col, Button, Row, CardTitle, Modal, Input, Icon } from 'react-materialize';
import { Route} from 'react-router-dom';
import requireLogin from './authenticate';
import Form from 'muicss/lib/react/form';
import "./user_profile.css";
import {Navigation} from './navbar';
import Container from 'muicss/lib/react/container';
import { ToastContainer, toast } from 'react-toastify';
import axiosConfig from '../components/baseConfig';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };
        this.onInputChange = this.onInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUserProfile = this.getUserProfile.bind(this);
        this.updatePasswordEmail = this.updatePasswordEmail.bind();
    }
    componentWillMount() {
        this.setState({ email: this.props.email, password: this.props.password });
        this.getUserProfile();
    }
    getUserProfile() {
        // Send GET request 
        axiosConfig.request({
            method: "get",
            url: `/user`,
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        }).then((response) => {
            this.setState({
                email: response.data.email,
            });

            return response.data;
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact ={true} path={`/user`} component={requireLogin(UserProfile)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

    }
    onInputChange(evt) {
        evt.preventDefault();
        let fields = {};
        fields[evt.target.name] = evt.target.value;
        this.setState(fields);
    }
    handleSubmit(evt) {
        evt.preventDefault();
        this.updatePasswordEmail(this.state.email, this.state.password);
    }
    updatePasswordEmail(email, password) {
        // Send PUT request  
        axiosConfig.request({
            method: "put",
            url: `/user`,
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            },
            data: { "email": email, "password": password }
        }).then((response) => {
            toast.success(response.data.message);
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(error.response.data.message);
                if(error.response.status === 408){
                    window.localStorage.removeItem('token');
                    return <Route exact ={true} path={`/user`} component={requireLogin(UserProfile)} />
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }
    render() {
        return (
            <div>
                <Navigation />
                <div className="page_content">
                    <Container fluid={true} >
                        <ToastContainer />
                        <Row>
                            <Col s={12} m={7} offset="m2">
                                <div>
                                    <Card
                                        header={<CardTitle image={require('../images/real-pic.jpeg')}>{this.state.email}</CardTitle>}
                                        actions={
                                            [<Modal
                                                trigger={<Button size="small" className="black yellow-text" waves='light' >
                                                    Update profile
                                    </Button>}
                                                header={<h4 className="mui--text-center teal-text">Change Email or Password</h4>}>
                                                <Row >
                                                    <Form onSubmit={this.handleSubmit}>
                                                        <Input label="Email" className="black-text" name="email" validate type='email'  value={this.state.email} onChange={this.onInputChange} ><Icon>email</Icon></Input>
                                                        <Input label="Password" className="black-text" name="password"  validate type='password' value={this.state.password} onChange={this.onInputChange} ><Icon>lock</Icon></Input><br />
                                                        <Button size="small" waves='light'>Update </Button>
                                                    </Form>
                                                </Row>
                                            </Modal>
                                            ]
                                        }>
                                        <Row>
                                            <Col>
                                                <h4>Profile user</h4>
                                                <p>{this.state.email}</p>
                                            </Col>
                                        </Row>

                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

export default UserProfile;