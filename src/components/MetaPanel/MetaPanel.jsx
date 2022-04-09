import React, { Component } from 'react';
import { getDatabase, ref,onValue, onChildAdded, onChildChanged } from "firebase/database";
import moment from 'moment';

export default class MetaPanel extends Component {
    state={
        groups: [],

        firstload: true,
        active: "",
    }

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

    addgrouponload = () =>{
        let firstgroup = this.state.groups[0]
        if(this.state.firstload  && this.state.groups.length > 0){
            this.setState({active: firstgroup.id})
        }
        this.setState({firstload: false})  
    }

    // groupChange = (group) =>{
    //     // console.log(group)
    //     this.setState({active: group.id})
    // }

    render() {
        // console.log(this.props.userId.uid);
        return (
            <div style={{background: "#1B204A", height: "100vh",paddingLeft: 20,}}>
                <div style={{marginTop: 20,color: "#fff",marginLeft: 44}}>
                    <h1 style={{color: "#157347"}}>
                        MetaPanel
                    </h1>
                    
                    {this.state.groups.map((item)=>(
                        
                        item.id == this.state.active ? 
                            <div 
                                // onClick={() => this.groupChange(item)} 
                            >

                                <div style={{marginTop: 30}}>
                                    <div class="text-muted" style={{marginBottom: 5}}>
                                        {moment(item.date).fromNow()}
                                        {/* {moment().format('LT')} */}
                                    </div>
                                    <h3>
                                        Created by
                                    </h3>

                                    <h5 style={{marginLeft: 20,marginTop: 10}}>
                                        {item.createdby}
                                    </h5>
                                </div>
                           </div>
                        :""
                        ))
                    }
                </div>    
            </div>
        )
    }
}
