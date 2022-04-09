import React, { Component } from 'react'
import { Form,Button,Alert,Container,Row,Col } from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, } from '@fortawesome/free-solid-svg-icons';
import {faGooglePlus} from '@fortawesome/free-brands-svg-icons';
import {getAuth, signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from '../../firebase'


export default class Register extends Component {
    state={
        email: "",
        password: "",
        errorMsg: "",
        loader: false
    } 
    signInGoogle = () =>{
        signInWithPopup(getAuth(), new GoogleAuthProvider())
        .then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });
    }
    handleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }


    isFormEmty = ({email,password}) =>{
        if(!email.length || !password.length){
            this.setState({errorMsg: "Fill in the All Field"})
        }else if(password.length < 8){
            this.setState({errorMsg: "Password Should be greater then 8"})
        }else{
            return true
        }
    }
    handleSubmit = (e) =>{
        e.preventDefault()
        
        if(this.isFormEmty(this.state)){
            this.setState({loader: true})

            signInWithEmailAndPassword(getAuth(), this.state.email, this.state.password)
            .then((userCredential) => {
                console.log(userCredential)
                this.setState({loader: false})
            })
            .catch((error) => {
                this.setState({loader: false})
                const errorCode = error.code
                if(errorCode.includes("user")){
                    this.setState({errorMsg: "Email doesn't match"})
                }else if(errorCode.includes("wrong-password")){
                    this.setState({errorMsg: "Wrong Password"})
                }
            });

        }
    }

    render() {
        const { email,password,errorMsg,loader } = this.state 
        return (
            <Container>
                <Row style={{color: "#0B5ED7",textAlign: "center", marginTop: "50px"}}>
                    <h1>
                        <FontAwesomeIcon style={{fontSize: 70}} icon={faUsers} />
                    </h1>
                    <h1 style={{fontSize: 40}}>
                        Lets start MERN Adda
                    </h1>
                </Row>
                <Row>
                    <Col>
                    
                    <Form onSubmit={this.handleSubmit} style={{width:"100%", marginLeft:"20%", marginTop: 52, maxWidth: 500}}>
                        <div>
                            <Button style={{marginBottom: 10, marginTop: "20px", width: "30%",background: "#E0321C"}} onClick={this.signInGoogle} >
                               <FontAwesomeIcon style={{marginRight: 10}}
                                    icon={faGooglePlus} 
                                /> 
                                Google Plus
                            </Button>
                        </div>

                        {errorMsg ?
                            <Alert variant="danger">
                                {errorMsg}
                            </Alert> : ""
                        }
                        <Form.Group>
                            <Form.Label>
                                Email
                            </Form.Label>
                            <Form.Control 
                                name="email" 
                                placeholder='Your E-mail' 
                                type='email' 
                                onChange={this.handleChange}
                                value={email}
                            />
                        </Form.Group>

                        <Form.Group style={{marginTop: "5px"}}>
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Form.Control 
                                name="password" 
                                placeholder='Your Passsword' 
                                type='password' 
                                onChange={this.handleChange}
                                value={password} 
                            />
                        </Form.Group>

                        <Button style={{marginTop: "5px",background: "#FA9746",}} type="submit">Submit</Button>

                        <div>
                            <Button style={{marginTop: 10, width: "100%",background: "#0B5ED7"}}>
                                Already have an account?
                            </Button>
                            <Link style={{marginLeft: "40%"}} to="/register">Sign Up</Link>
                        </div>
                    </Form>
                    </Col>

                    <Col>
                        {/* =========================IMAGE================== */}
                        <Col style={{width: "100%", marginLeft: "150px"}}>
                            <Image src="./image/login img.jpg" thumbnail style={{border:"none"}} /> 
                        </Col>
                        {/* =========================IMAGE================== */}
                    </Col>
                </Row>
            </Container>
            
        )
    }
}