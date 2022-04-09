import React, { Component } from 'react';
// import { Container,Row,Col,Dropdown } from 'react-bootstrap';
import { getAuth, signOut } from "../../firebase";
import { onChildAdded, onChildChanged,onChildRemoved,ref as rof } from "firebase/database";


import { uploadBytesResumable,ref, getDownloadURL } from 'firebase/storage'
import { Dropdown,Container,Row,Modal,Button,Form,Alert,Col,FormControl,InputGroup,ProgressBar,Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers,faUpload } from '@fortawesome/free-solid-svg-icons';
import { storage,getDatabase, push, set,child, ref as refer } from '../../firebase'


export default class UserPanel extends Component {
    state={
        file: "",
        progress: "",
        modal: false,

        profiles: [],
        profileup: true
    }
   // ==================> profile pic sent  to Database <=========================================>

    openModal = () =>{
        this.setState({modal: true})
    }
    closeModal = () =>{
        this.setState({modal: false})
    }


    handleImage = (e) =>{
        this.setState({file: e.target.files[0]})
    }

    handleUpload = () =>{
        if(this.state.file){
            let storageRef = ref(storage, `files1/${this.state.file.name}`)
            let uploadtask = uploadBytesResumable(storageRef, this.state.file)
            uploadtask.on("state_changed", (snapshot)=>{
                let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                this.setState({progress: progress})
                console.log(this.state.progress)
            },(err)=>{
                console.log(err)
            },()=>{
                getDownloadURL(uploadtask.snapshot.ref).then((url)=>{
                    console.log(url)

                    const groupsRef = refer(getDatabase(), 'files1');
                    const newGroup = (child(groupsRef, `${this.props.userId.uid}`));
                    set(newGroup, {
                        fileurl: url,
                        date: Date(),
                        sender: this.props.userId.uid,
                        username: this.props.userId.displayName
                    }).then(()=>{
                        this.setState({profileup: true})
                        this.closeModal()
                        this.setState({progress: ""})
                        console.log("file geche db e")
                    }).catch(err=>{
                        // console.log("ami")
                    })
                })
            })
        }else{
            console.log("data nai")
        }
    }

   // ==================> profiles after load <=========================================//
    componentDidUpdate(){
        let filearr = []
        const filesRef = rof(getDatabase(), 'files1/');
        onChildAdded(filesRef, (data) => {
            // console.log(data.val());
            filearr.push(data.val())
            // console.log(filearr);
            if(this.state.profileup){
                this.setState({profiles: filearr})
                // console.log(this.state.profiles);
                this.setState({profileup: false})
            }
        });
    }

   // ==================> LogOut <=========================================>
    handleLogOut = () =>{
        signOut(getAuth()).then(() => {
            console.log("Logout")
        }).catch((error) => {
            console.log(error)
        });
    }

    render() {
        // console.log(this.props.userId);
        return (
            <Container>

                {/* ==================> Profile <=========================================> */}
                <Row style={{marginTop: 10,marginLeft: 70,}}>

                    {/* Profile show */}
                    <div >
                        {this.state.profiles.map((item)=>(
                            item.sender == this.props.userId.uid?
                            <div>
                                <Image style={{width: 60, height: 60,borderRadius: "50%",marginLeft: 13,marginBottom: 5}}  
                                    src={item.fileurl}/>   
                            </div>
                        : 
                        ""
                        ))
                        }
                    </div>
                            

                    {/* <div>
                        {this.state.profiles.map((item)=>(
                            
                        }
                    </div> */}
                    
                    {/* Profile show */}

                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Profile
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">
                                Loged As {this.props.userName} 
                            </Dropdown.Item>
                            <Dropdown.Item 
                                href="#/action-2"
                                onClick={this.openModal}
                            >
                                Change Profile Pic
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-3" onClick={this.handleLogOut}>
                                Log Out
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Row>

                {/* ==================> Profile pic upload Modal <=========================================> */}
                <Modal
                show={this.state.modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    <FontAwesomeIcon style={{color: "#0B5ED7", fontSize: 70,marginLeft: 350}} icon={faUsers} />
                    <h1 style={{marginLeft: 250,fontSize: 30}}>
                        Upload Profile Picture
                    </h1>
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body style={{marginTop: 10}}>
                    <InputGroup style={{width: 300}}>
                        <InputGroup.Text>
                            <FontAwesomeIcon  icon={faUpload} />
                        </InputGroup.Text>
                        <FormControl
                            onChange={this.handleImage} 
                            type="file" 
                            icon='upload' 
                            placeholder='Search...'
                        />
                    </InputGroup>
                    
                    {this.state.progress ?
                        <ProgressBar now={this.state.progress} label={`${this.state.progress}%`} /> : ""
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        onClick={this.handleUpload}
                        variant="primary" 
                    >
                        Upload
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={this.closeModal}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
                </Modal>
            </Container>
        )
    }
}
