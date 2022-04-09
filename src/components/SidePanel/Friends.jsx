import React, { Component } from 'react';
import { getDatabase, ref, set,push,child,onValue,onChildAdded,onChildRemoved, onChildChanged,onDisconnect } from "firebase/database";
import { Container,Row,Modal,Button,Form,Alert,Col,InputGroup,FormControl,Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers,faCircle} from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { setsingleuser } from '../../actions/main';


class Friends extends Component {
    state = {
        user: this.props.user,
        users: [],
        alert: false,

        firstload: true,
        active: "",

        // its for search
        searchterm: "",
        searchloading: "",
        searchresult: [],

    }


    componentDidMount () {
        if(this.state.user){
            this.addEvenListeners(this.state.user)
        }
    }

    addEvenListeners = (currentUser) =>{
        let loadedUsers = []
        const usersRef = ref(getDatabase(), 'users/');
        const connectRef = ref(getDatabase(), '.info/connected');// ekhane 'info/connected' firebase docs theke anchi
        const presentRef = ref(getDatabase(), 'present/' + currentUser.uid);
        const presentRef2 = ref(getDatabase(), 'present/');
        

        onChildAdded(usersRef, (snap) => {
            let user = snap.val()
            // console.log(user);
            user['uid'] = snap.key
            user['status']= ''
            loadedUsers.push(user)
            // console.log(snap.key);
            this.setState({users: loadedUsers}, this.adduseronload)
        })
        // console.log(this.state.users);
        
        onValue(connectRef, (snap) => {
            if(snap.val() === true){
                set(presentRef, {
                    username: currentUser.displayName,
                    status: true
                }).then(()=>{

                })
                onDisconnect(presentRef).remove(err=>{
                    if(err !== null){
                        console.log("ami err", err);
                    }
                })
            }
        })

        onChildAdded(presentRef2, (snap) => {

            this.addUserStatus(snap.key,true)

        })

        onChildRemoved(usersRef, (snap) => {

            this.addUserStatus(snap.key,false)

        })
    }
    
    addUserStatus = (userid,connected) =>{
        let updateUser = this.state.users.reduce((initialvalue,user)=>{
            
            if(user.uid === userid){

                user['status'] = `${connected ?  "on" : ""}`
            }
            initialvalue.push(user) 
            return initialvalue
        },[])
        this.setState({users: updateUser})
        // console.log(this.state.users);
    }

    
    adduseronload = () =>{
        let firstgroup = this.state.users[0]
        // console.log(firstgroup);
        if(this.state.firstload  && this.state.users.length > 0){
            this.props.setsingleuser(firstgroup)
            // console.log( firstgroup.id);
            this.setState({active: firstgroup.id})
        }
        this.setState({firstload: false})  
    }

    suserChange = (suser) =>{
        // console.log(suser)
        this.setState({active: suser.uid})
        this.props.setsingleuser(suser)
    }
    



    // ==================> Search <=========================================//
    handleSearchChange = (e) =>{
        this.setState({searchterm: e.target.value,searchloading: true},()=> this.handleSearchMessage())
        // console.log(this.state.searchterm)
    }

    handleSearchMessage = () =>{
        let users = [...this.state.users]
        let regex = new RegExp (this.state.searchterm,'gi')
        let searchresult = users.reduce((initvalue,message)=>{
            console.log(message);
            if(message.username && message.username.match(regex)){
                
                initvalue.push(message)
            }
            return initvalue
        },[])
        this.setState({searchresult: searchresult})
    }


   

    render() {
        // console.log(this.props.suser);
        return (
            <>
                {/* ==================> Friends count <========================================= */}
                <Row style={{marginTop: 30, marginLeft: 5, color: "#fff" }}>
                    <h4>
                        Friends
                        ({this.state.users.length})
                        <FontAwesomeIcon  
                            style={{marginLeft: 94}} 
                            icon={faUsers} 
                        />
                    </h4>
                </Row>
                {/* ==================> Friends search <========================================= */}
                <Row style={{width: 243,marginTop: 10,marginLeft: 14,marginBottom: 15,}}>
                    <FormControl
                        onChange={this.handleSearchChange}
                        type="search" 
                        placeholder="search message"
                    />
                </Row>

                {/* ==================> Show Friends data & Search option <========================================= */}
                <Row >
                    <Card style={{height: "150px", overflowY: "scroll", width: "80%",marginLeft: 26,background: "#fff" }}>
                        <Col border="dark" style={{marginTop: 5}} >

                            {this.state.searchterm ?
                                this.state.searchresult.map((item)=>(

                                <Col style={menulist}>
                                    <div style={{display: "flex", justifyContent: "space-between"}}

                                        style={item.uid == this.state.active ? menulistactive : menulist}
                                        onClick={() => this.suserChange(item)}
                                    >
                                        <span>
                                            {item.username} 
                                        </span>
                                        <span style={{ color: "red", fontSize: 20,fontWeight: 500, marginLeft: 83, color: "blue"}}>
                                            {item.status}
                                        </span>
                                    </div>
                                </Col>
                                ))
                            :
                                this.state.users.map((item)=>(

                                    <Col style={menulist}>
                                        <div style={{display: "flex", justifyContent: "space-between"}}

                                            style={item.uid == this.state.active ? menulistactive : menulist}
                                            onClick={() => this.suserChange(item)}
                                        >
                                            <span>
                                                {item.username} 
                                            </span>
                                            <span style={{ color: "red", fontSize: 20,fontWeight: 500, marginLeft: 83, color: "blue"}}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </Col>
                                ))
                            }

                        </Col>
                    </Card>
                </Row>

            </>
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


export default connect(null, { setsingleuser }) (Friends);