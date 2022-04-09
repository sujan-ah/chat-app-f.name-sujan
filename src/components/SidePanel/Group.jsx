import React, { Component } from 'react';
import { Container,Row,Modal,Button,Form,Alert,Col,InputGroup,FormControl,Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare,faUsers,faSearch } from '@fortawesome/free-solid-svg-icons';

import { getDatabase, ref, push, set,onValue,child } from "firebase/database";
import { connect } from 'react-redux';
import { setcurrentgroup } from '../../actions/main';


class Group extends Component {
    state={
        groups: [],
        modal: false,
        groupname: "",
        grouptagline: "",
        err: "",

        firstload: true,
        active: "",

        // its for search
        searchterm: "",
        searchloading: "",
        searchresult: [],
    }
    openModal = () =>{
        this.setState({modal: true})
    }
    closeModal = () =>{
        this.setState({modal: false})
    }

    // ==================> Groupname sent to database <=========================================//
    
    handleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }
    isFormValid = ({groupname,grouptagline}) =>{
        if(groupname && grouptagline){
            return true
        }else{
            return false
        }
    }
    handleSubmit = (e) =>{
        e.preventDefault()

        if(this.isFormValid(this.state)){
            const db = getDatabase();
            const groupsRef = ref(db, 'groups');
            const newGroup = push(groupsRef);
            // const newGroup = push(child(groupsRef, `${this.props.groupId.id}`));
            set(newGroup, {
                groupname: this.state.groupname,
                grouptagline: this.state.grouptagline,
                createdby: this.props.userName,
                sender: this.props.userId.uid,
                date: Date(),

                // its for Metapanel
                // date: Date(),
                // group: this.props.groupId.id,
                
            }).then(()=>{
                this.setState({modal: false})
                this.setState({groupname: ""})
                this.setState({grouptagline: ""})
                this.setState({err: ""})
            })
        }else{
            this.setState({err: "Please Fill The Information Box"})
        }
    }


    // ==================> Show Groupname <=========================================//

    componentDidMount(){
        
        const db = getDatabase();
        const groupRef = ref(db, 'groups/');
        onValue(groupRef, (snapshot) => {
            let groupsafterload = []

            snapshot.forEach(item =>{
                // console.log(item.val())
                let groupdata = {
                    id: item.key,
                    groupname: item.val().groupname,
                    grouptagline: item.val().grouptagline,
                    createdby: this.props.userName,
                }
                groupsafterload.push(groupdata)
            })
            // console.log(groupsafterload);
            this.setState({groups: groupsafterload}, this.addgrouponload)
        });
        // console.log(this.state.groups);
    }
    // ==================> Show after load <=========================================//
    addgrouponload = () =>{
        let firstgroup = this.state.groups[0]
        // console.log(firstgroup);
        if(this.state.firstload  && this.state.groups.length > 0){
            this.props.setcurrentgroup(firstgroup)
            this.setState({active: firstgroup.id})
        }
        this.setState({firstload: false})  
    }

    // onClick for devtools redux
    groupChange = (group) =>{
        console.log(group)
        this.setState({active: group.id})
        this.props.setcurrentgroup(group)
    }
    // onClick for devtools redux

    // ==================> Search <=========================================//
    handleSearchChange = (e) =>{
        this.setState({searchterm: e.target.value,searchloading: true},()=> this.handleSearchMessage())
        // console.log(this.state.searchterm)
    }

    handleSearchMessage = () =>{
        let groups = [...this.state.groups]
        let regex = new RegExp (this.state.searchterm,'gi')
        let searchresult = groups.reduce((initvalue,message)=>{
            console.log(message);
            if(message.groupname && message.groupname.match(regex)){
                
                initvalue.push(message)
            }
            return initvalue
        },[])
        this.setState({searchresult: searchresult})
    }



    render() {
        // console.log(this.props);
        return (
            <Container>
                {/* ==================> Group count <========================================= */}
                <Row style={{marginTop: 30, color: "#fff",marginLeft: 3, }}>
                    <h4 >
                        Groups
                        ({this.state.groups.length})
                        <FontAwesomeIcon style={{marginLeft: 104,fontSize: 25}} 
                            onClick={this.openModal} 
                            icon={faPlusSquare} 
                        />
                        
                    </h4>
                </Row>

                {/* ==================> Group search <========================================= */}
                <Row style={{width: 243,marginTop: 10,marginLeft: 14,marginBottom: 15,}}>
                    <FormControl
                        onChange={this.handleSearchChange}
                        type="search" 
                        placeholder="search message"
                    />
                </Row>

                {/* ==================> Show group data & Search option <========================================= */}
                <Row >
                    <Card style={{height: "150px", overflowY: "scroll", width: "80%",marginLeft: 26,background: "#fff" }}>
                        <Col border="dark" style={{marginTop: 5}} >

                            {this.state.searchterm ?

                                this.state.searchresult.map((item)=>(
                                    <Col style={item.id == this.state.active ? menulistactive : menulist} 
                                        onClick={() => this.groupChange(item)} 
                                    >

                                        {item.groupname}
                                    </Col>
                                ))
                            :
                                // ==> Show Groupname <===//
                                this.state.groups.map((item)=>(
                                    <Col style={item.id == this.state.active ? menulistactive : menulist} 
                                        onClick={() => this.groupChange(item)} 
                                    >

                                        {item.groupname}
                                    </Col>
                                ))
                               
                                
                            }  
                        </Col>
                    </Card>
                </Row>

                {/* ==================> Modal <========================================= */}
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
                            Add Groups Details
                        </h1>
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                    <Form onSubmit={this.handleSubmit}style={{width: 500}}>
                        <Form.Group className="mb-3" controlId="formBasicEmail" >
                            <Form.Label>
                                Group Name
                            </Form.Label>
                            <Form.Control 
                                name="groupname" 
                                onChange={this.handleChange}  
                                placeholder='Group Name' 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword" >
                            <Form.Label>
                                Group Tagline
                            </Form.Label>
                            <Form.Control 
                                name="grouptagline" 
                                onChange={this.handleChange} 
                                placeholder='Group Tagline' 
                            />
                        </Form.Group>
                        {this.state.err ?
                        <Alert variant="danger">
                            {this.state.err}
                        </Alert> : ""
                    }
                    </Form>
                    
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" 
                            onClick={this.handleSubmit}>
                            Add Group
                        </Button>
                        <Button variant="danger" 
                            onClick={this.closeModal}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
           
        )
    }
}

let menulist = {
    
    color: "#000",
    fontSize: "16px",
    marginTop: "10px"
}

let menulistactive = {
    width: "200px",
    color: "#fff",
    fontSize: "20px",
    background: "green",
    padding: "10px",
    borderRadius: "5px"
}


export default connect(null, { setcurrentgroup }) (Group);