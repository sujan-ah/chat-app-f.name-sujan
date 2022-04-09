import React, { Component } from 'react';
import { Container,Card,InputGroup,Form,FormControl,Row,Col,Image,img } from 'react-bootstrap';
import MessageHeader from './MessageHeader'
import MessageForm from './MessageForm';
import { getDatabase, ref, onChildAdded, onChildChanged } from "firebase/database";
import moment from 'moment';


export default class Message extends Component {
    state={
        groupmsg: [],
        groupfiles: [],
        usercount: [],
        // its for susermsg
        susermsg: [],

        // its for search
        searchterm: "",
        searchloading: "",
        searchresult: [],
    }

    componentDidUpdate(previousProps){
        // console.log(previousProps.groupId);
        // console.log(this.props.groupId);


        // ==================> groupmsg <=========================================//
        let msg = []
        let user = []
        const commentsRef = ref(getDatabase(), 'messages/');
        onChildAdded(commentsRef, (data) => {
            // console.log(data.val())
            data.forEach(item=>{
                // console.log(item.val())
                msg.push(item.val())
                if(user.indexOf(item.val().sender) === -1 && this.props.groupId.id === item.val().group){
                    user.push(item.val().sender)
                }
            })
            if(previousProps.groupId){
                // console.log(this.props.groupId);
                if(previousProps.groupId.groupname !== this.props.groupId.groupname){
                    this.setState({groupmsg: msg})
                    this.setState({usercount: user})
                }
                // console.log(this.state.groupmsg);
                // console.log("ager dol",previousProps.groupId.groupname)
                // console.log("bortoman dol",this.props.groupId.groupname)
            }else{
                this.setState({groupmsg: msg})
                this.setState({usercount: user})
            }
        });
        onChildChanged(commentsRef, (data) => {
            let msg = []
            // console.log(data.val())
            data.forEach(item=>{
                // console.log(item.val())
                msg.push(item.val())
                if(user.indexOf(item.val().sender) === -1 && this.props.groupId.id === item.val().group){
                    user.push(item.val().sender)
                }
            })

            if(previousProps.groupId){
                if(previousProps.groupId.groupname !== this.props.groupId.groupname){
                    this.setState({groupmsg: msg})
                    this.setState({usercount: user})
                }
                // console.log("ager dol",previousProps.groupId.groupname)
                // console.log("bortoman dol",this.props.groupId.groupname)
            }else{
                this.setState({groupmsg: msg})
                this.setState({usercount: user})
            }
        }); 

        // ==================> groupfiles <=========================================//

        let filearr = []
        const filesRef = ref(getDatabase(), 'files/');
        onChildAdded(filesRef, (data) => {
            data.forEach(item=>{
                // console.log(item.val());
                filearr.push(item.val())
                if(user.indexOf(item.val().sender) === -1 && this.props.groupId.id === item.val().group){
                    user.push(item.val().sender)
                }
            })

            if(previousProps.groupId){
                if(previousProps.groupId.groupname !== this.props.groupId.groupname){
                    this.setState({groupfiles: filearr})
                    this.setState({usercount: user})
                }
            }else{
                this.setState({groupfiles: filearr})
                this.setState({usercount: user})
            }
        });
        onChildChanged(filesRef, (data) => {
            let filearr = []
            data.forEach(item=>{
                filearr.push(item.val())
                if(user.indexOf(item.val().sender) === -1 && this.props.groupId.id === item.val().group){
                    user.push(item.val().sender)
                }
            })

            if(previousProps.groupId){
                if(previousProps.groupId.groupname !== this.props.groupId.groupname){
                    this.setState({groupfiles: filearr})
                    this.setState({usercount: user})
                }
            }else{
                this.setState({groupfiles: filearr})
                this.setState({usercount: user})
            }
        });

        // ==================> susermsg show <=========================================//
        let smsg = []
        const suserRef = ref(getDatabase(), 'singlemessages/');
        onChildAdded(suserRef, (data) => {
            // console.log(data.val())
            data.forEach(item=>{
                // console.log(item.val())
                smsg.push(item.val())
            })
            if(previousProps.suserUid){
                if(previousProps.suserUid.username !== this.props.suserUid.username){
                    this.setState({susermsg: smsg})
                }
            }else{
                this.setState({susermsg: smsg})
            }
            // console.log(this.state.susermsg);
        });
        onChildChanged(suserRef, (data) => {
            // console.log(data.val())
            data.forEach(item=>{
                // console.log(item.val())
                smsg.push(item.val())
            })
            if(previousProps.suserUid){
                // console.log(this.props.groupId);
                if(previousProps.suserUid.username !== this.props.suserUid.username){
                    this.setState({susermsg: smsg})
                }
                // console.log(this.state.groupmsg);
                // console.log("ager dol",previousProps.suserUid.username)
                // console.log("bortoman dol",this.props.suserUid.username)
            }else{
                this.setState({susermsg: smsg})
            }
            console.log(this.state.susermsg);
        });
       
    }

    // ==================> Search <=========================================//

    handleSearchChange = (e) =>{
        this.setState({searchterm: e.target.value,searchloading: true},()=> this.handleSearchMessage())
        // console.log(this.state.searchterm)
    }

    handleSearchMessage = () =>{
        let groupmsg = [...this.state.groupmsg]
        let regex = new RegExp (this.state.searchterm,'gi')
        let searchresult = groupmsg.reduce((initvalue,message)=>{
            if(message.msg && message.msg.match(regex)){
                initvalue.push(message)
            }
            return initvalue
        },[])
        this.setState({searchresult: searchresult})
    }

    render() {
        // console.log(this.props.suserUid);
        return (
            <Container>
                {/* ==================> MessageHeader Part <========================================= */}
                <Row>
                    <MessageHeader 
                        handleSearchChange = {this.handleSearchChange}
                        totaluser={this.state.usercount}
                    />
                </Row>
                {/* ==================> Message Part <========================================= */}
                <Row>
                    <Card style={{height: "600px", overflowY: "scroll", width: "100%" }}>
                        <Col border="dark" style={{marginTop: 5}} >

                            {this.state.searchterm ?

                                this.state.searchresult.map((item)=>(
                                    item.group == this.props.groupId.id ?
                                    
                                    <div style={this.props.userId.uid == item.sender ? right : left}>
                                        <div>
                                            <div class="text-muted">
                                                {moment(item.date).format('LT')}
                                            </div>
                                            <h8 class="text-muted" >
                                                {item.username}
                                            </h8>
                                            <h6 class="card-text">
                                                {item.msg}
                                            </h6>
                                        </div>
                                    </div>

                                    :
                                    ""
                                ))

                            :

                                // ==================> groupmsg show  <=========================================// */}

                                this.state.groupmsg.map((item)=>(
                                    item.group == this.props.groupId.id ?

                                    <div style={this.props.userId.uid == item.sender ? right : left}>
                                        <div>
                                            <div class="text-muted">
                                                {moment(item.date).fromNow()}
                                            </div>
                                            <h8 class="text-muted" >
                                                {item.username}
                                            </h8>
                                            {/* <h6 class="card-text">
                                                {item.msg}
                                            </h6> */}
                                            <Card style={{height: "auto", width: "auto",background: "#EEF5F8",padding: 5,borderRadius: 50 }}>
                                                <Col border="dark" >
                                                    <h6 class="card-text">
                                                        {item.msg}
                                                    </h6>
                                                </Col>
                                            </Card>
                                        </div>
                                    </div>

                                :
                                ""
                                ))
                                
                                
                                
                            }

                            {/* // ==================> groupfiles show <=========================================// */}


                            {this.state.groupfiles.map((item)=>(
                                item.group == this.props.groupId.id ?
                                
                                <div style={this.props.userId.uid == item.sender ? right : left}>
                                    <div>
                                        <div class="text-muted">
                                            {moment(item.date).fromNow()}
                                        </div>
                                        <h8 class="text-muted" >
                                            {item.username}
                                        </h8>
                                        <div style={{width: 200, height: 150}}>
                                            <Image style={{width: "100%",}} src={item.fileurl}/>   
                                        </div>
                                    </div>
                                </div>

                                : 
                                ""
                                ))
                            }
                            
                            {/* ==================> susermsg show  <========================================= */}


                            {/* {this.state.susermsg.map((item)=>(
                                item.id == this.props.userId.uid ?

                                <div style={this.props.userId.uid == item.sender ? right : left}>
                                    <div>
                                        <div class="text-muted">
                                            {moment(item.date).fromNow()}
                                        </div>
                                        <h8 class="text-muted" >
                                            {item.username}
                                        </h8>
                                        <h6 class="card-text">
                                            {item.susermsg}
                                        </h6>
                                    </div>
                                </div>

                            :
                            ""
                            ))} */}
                            {this.state.susermsg.map((item)=>{
                                // console.log(item);
                            })}

                        </Col>
                    </Card>
                        
                </Row>
                {/* ==================> MessageForm Part <========================================= */}
                <Row >
                    <MessageForm 
                        groupId={this.props.groupId} 
                        userId={this.props.userId}
                        suserUid={this.props.suserUid}
                    />
                </Row>
            </Container>
            
        )
    }
}


const right={
    display: "flex",
    justifyContent: "flex-end" 
}

const left={
    display: "flex",
    justifyContent: "flex-start" 
}