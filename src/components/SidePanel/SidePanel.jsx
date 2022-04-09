import React, { Component } from 'react';
import UserPanel from './UserPanel';
import Group from './Group';
import Friends from './Friends';


export default class SidePanel extends Component {
    render() {
        // console.log(this.props.groupId)
        return (
            <div style={{ background: "#473FE1",width: "100%", height: "100vh", padding: "20px"}}>
                <UserPanel 
                    userName={this.props.userName}

                    // its for profile pic
                    groupId={this.props.groupId} 
                    userId={this.props.userId}
                />
                <Group
                    userName={this.props.userName}

                    // its for Metapanel
                    groupId={this.props.groupId}
                    userId={this.props.userId}
                />
                <Friends 
                    user={this.props.user}
                />
            
            </div>
        )
    }
}
