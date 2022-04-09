import React, { Component } from 'react'
import { Form,Button,Alert,Container,Row,Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { fa } from '@fortawesome/free-solid-svg-icons';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword,updateProfile,getDatabase, ref, set  } from '../../firebase'

export default class Register extends Component {
    state={
        username: "",
        email: "",
        password: "",
        confirmPassword:"",
        errorMsg: "",
        successMsg: "",
        loader: false
    } 
    handleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }
    isFormEmty = ({username,email,password,confirmPassword}) =>{
        if(!username.length || !email.length || !password.length || !confirmPassword.length){
            this.setState({errorMsg: "Fill in the All Field"})
        }else if(password.length < 8 || confirmPassword.length < 8){
            this.setState({errorMsg: "Password Should be greater then 8"})
        }else if(password !== confirmPassword){
            this.setState({errorMsg: "Password Doesn't Match"})
        }else{
            return true
        }
    }
    handleSubmit = (e) =>{
        e.preventDefault()
        
        if(this.isFormEmty(this.state)){
            this.setState({loader: true})
            createUserWithEmailAndPassword(getAuth(), this.state.email, this.state.password)
            .then((userCredential) => {
                console.log(userCredential)
                
                updateProfile(getAuth().currentUser, {
                    displayName: this.state.username
                })
                .then(() => {
                    this.writeUserData(userCredential)
                })
                .then(() => {
                    this.setState({username: ""})
                    this.setState({email: ""})
                    this.setState({password: ""})
                    this.setState({confirmPassword: ""})
                    this.setState({errorMsg: ""})
                    this.setState({successMsg: "Account Created Successful"})
                    this.setState({loader: false})
                })
                .catch((error) => {
                    this.setState({loader: false})
                    const errorCode = error.code;
                    if(errorCode){
                        this.setState({errorMsg: "Username not Valid"})
                    }
                }); 
            })
            .catch((error) => {
                this.setState({loader: false})
                const errorCode = error.code;
                if(errorCode.includes("email")){
                    this.setState({errorMsg: "Email Already in Use"})
                }
            });
        }
    }
    writeUserData(user) {
        const db = getDatabase();
        set(ref(db, 'users/' + user.user.uid), {
          username: this.state.username,
        });
    }

    render() {
        const { username,email,password,confirmPassword,errorMsg,successMsg,loader } = this.state 
        return (
            <Container>
                 <Row style={{color: "#0B5ED7",textAlign: "center", marginTop: "50px"}}>
                    <h1>
                        <FontAwesomeIcon style={{fontSize: 70}} icon={faUsers} />
                    </h1>
                    <h1 style={{fontSize: 40}}>
                        Lets join MERN Adda
                    </h1>
                </Row>
                
                <Row style={{marginTop: "50px"}}>
                    <Col>
                    <Form onSubmit={this.handleSubmit} style={{width:"100%", marginLeft:"20%", maxWidth: "500px", marginTop: "30px"}}>
                        {errorMsg ?
                            <Alert variant="danger">
                                {errorMsg}
                            </Alert> : ""
                        }
                        {successMsg ?
                            <Alert variant="success">
                                {successMsg}
                            </Alert> : ""
                        }
                        
                        <Form.Group>
                            <Form.Label>
                                User Name
                            </Form.Label>
                            <Form.Control
                                name="username" 
                                placeholder='First Name' 
                                type='text' 
                                onChange={this.handleChange}
                                value={username} 
                            />
                        </Form.Group>
                        <Form.Group style={{marginTop: "5px"}}>
                            <Form.Label>
                                Email
                            </Form.Label>
                            <Form.Control
                                name="email" 
                                placeholder='E-mail' 
                                type='email' 
                                onChange={this.handleChange}
                                value={email} 
                            />
                        </Form.Group>

                        <Form.Group  style={{marginTop: "5px"}}>
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Form.Control 
                                name="password" 
                                placeholder='Passsword' 
                                type='password' 
                                onChange={this.handleChange}
                                value={password}  
                            />
                        </Form.Group>

                        <Form.Group style={{marginTop: "5px"}}>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control 
                                name="confirmPassword" 
                                placeholder='Confirm Passsword' 
                                type='password' 
                                onChange={this.handleChange}
                                value={confirmPassword}  
                            />
                        </Form.Group>

                        <Button style={{marginTop: "5px"}} type="submit">Submit</Button>
                        <Col>
                            <Button style={{marginTop: "20px", width: "100%",background: "#2D8B70"}}>
                                Already have an account?
                            </Button>
                            <Link style={{marginLeft: "40%"}} to="/login">Log In</Link>
                        </Col>
                        
                    </Form>
                    </Col>

                    <Col>
                    {/* ==============================IMAGE================================== */}
                    <div style={{width: "100%", marginLeft: "100px"}}>
                        <Image src="./image/register img.jpg" thumbnail style={{border:"none"}} /> 
                    </div>
                    {/* ==============================IMAGE================================== */}
                    </Col>
                    
               </Row>
            </Container>
            
        )
    }
}
