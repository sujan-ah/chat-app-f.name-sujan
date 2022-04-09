import React, { Component } from 'react';
import { uploadBytesResumable,ref, getDownloadURL } from 'firebase/storage'
import { Container,Row,Modal,Button,Form,Alert,Col,FormControl,InputGroup,ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers,faUpload } from '@fortawesome/free-solid-svg-icons';

import { storage,getDatabase, push, set,child, ref as refer } from '../../firebase'


export default class ImageModal extends Component {
    state={
        file: "",
        progress: ""
    }

    // <====================> file sent  to Database <=========================================>
    handleImage = (e) =>{
        console.log(e.target);
        this.setState({file: e.target.files[0]})
    }

    handleUpload = () =>{
        if(this.state.file){
            let storageRef = ref(storage, `files/${this.state.file.name}`)
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

                    const groupsRef = refer(getDatabase(), 'files');
                    const newGroup = push(child(groupsRef, `${this.props.groupId.id}`));
                    set(newGroup, {
                        fileurl: url,
                        date: Date(),
                        sender: this.props.userId.uid,
                        group: this.props.groupId.id,
                        username: this.props.userId.displayName
                    }).then(()=>{
                        this.props.close()
                        this.setState({progress: ""})
                        console.log("file geche db e")
                    }).catch(err=>{
                        console.log("ami")
                    })
                })
            })
        }else{
            console.log("data nai")
        }
    }

    render() {
        return (
            // <====================> file upload Modal <=========================================>
            <Modal
                show={this.props.modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    <FontAwesomeIcon style={{color: "#0B5ED7", fontSize: 70,marginLeft: 350}} icon={faUsers} />
                    <h1 style={{marginLeft: 250,fontSize: 30}}>
                        Add Groups Details
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
                        onClick={this.props.close}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
