import React, { Component } from 'react';
import { Form,Col,Row,Card, Button,Alert } from 'react-bootstrap';
import { getDatabase, ref, push, set,child } from "firebase/database";
import ImageMdal from './ImageMdal'

export default class MessageForm extends Component {
    state={
        msg: "",
        err: "",
        modal: false,

        // its for susermsg
        susermsg: [],
    }

    // ==================> groupfiles Modal open close <=========================================>
    openModal = () =>{
        this.setState({modal: true})
    }
    closeModal = () =>{
        this.setState({modal: false})
    }

    // <====================> Groupmsg sent  to Database <=========================================>
    handleMsgChange = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = () =>{
        if(this.state.msg){
            const groupsRef = ref(getDatabase(), 'messages');
            const newGroup = push(child(groupsRef, `${this.props.groupId.id}`));
            set(newGroup, {
            
                msg: this.state.msg,
                date: Date(),
                sender: this.props.userId.uid,
                group: this.props.groupId.id,
                username: this.props.userId.displayName
            }).then(()=>{
                console.log("msg geche db e")
            })

            this.setState({err: ""})
        }else{
            this.setState({err: "Please Add a Message"})
        }
        
    }


    // ==================> its for susermsg <=========================================//
    handleSingMsgChange = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }

    handleSingSubmit = () =>{
        if(this.state.susermsg){
            const usersRef = ref(getDatabase(), 'singlemessages');
            const newUser = push(child(usersRef, `${this.props.suserUid.uid}`));
            set(newUser, {
                susermsg: this.state.susermsg,
                date: Date(),
                sender: this.props.suserUid.uid,
                group: this.props.groupId.id,
                username: this.props.userId.displayName
            }).then(()=>{
                console.log("msg geche db e")
            })

            this.setState({err: ""})
        }else{
            this.setState({err: "Please Add a Message"})
        }
        
    }


    render() {
        // console.log(this.props.suserUid);
        return (
            
            <Card style={{paddingBottom: 84}}>
                <Col border="dark" style={{marginTop: 20}}>
                    
                    <Form.Control  
                        name="msg"
                        onChange={this.handleMsgChange}
                        placeholder= "Aa"

                        // its for susermsg
                        // name="susermsg"
                        // onChange={this.handleSingMsgChange}
                    />
                </Col>

                {this.state.err ?
                    <Alert variant="danger">
                        {this.state.err}
                    </Alert> : ""
                }
                
                <Col style={{marginTop: 20,}}>
                    <Button style={{width: "49%"}}
                        variant="primary"  
                        onClick={this.handleSubmit} 

                        // its for susermsg
                        // onClick={this.handleSingSubmit} 
                    >
                        Add Message
                    </Button>
                    <Button 
                        style={{width: "49%",marginLeft: "2%"}}
                        variant="secondary" 
                        onClick={this.openModal}
                    >
                        Add Media
                    </Button>



                    {/*========== it is imageModal link =======================*/}
                    <ImageMdal 
                        modal={this.state.modal} 
                        close={this.closeModal}
                        userId={this.props.userId} 
                        groupId={this.props.groupId} 
                    />

                </Col>
            </Card>
        )
    }
}
