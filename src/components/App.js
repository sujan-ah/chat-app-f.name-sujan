import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner,Button,Container,Row,Col } from 'react-bootstrap';
import { getAuth } from '@firebase/auth';
import { setuser,clearuser } from '../actions/main';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Message from './Message/Message';
import MetaPanel from './MetaPanel/MetaPanel';


class App extends Component {
  componentDidMount(){
    getAuth().onAuthStateChanged((user)=> {
      if (user) {
       this.props.setuser(user)
      } else {
       this.props.clearuser()
      }
    });
  }


  render() {
    // console.log(this.props.suserUid);
    return this.props.isLoading?
      <>
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span className="visually-hidden">Loading...</span>
        </Button>{' '}
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
    </>
    :
    
    (
      <Container fluid>
        <Row>
          <Col className='row gx-0' md={1}>
            <ColorPanel></ColorPanel>
          </Col>

          <Col className='row gx-0' md={2}>
            <SidePanel 
              userName={this.props.userName.displayName} 
              user={this.props.userName}
              
              // its for profile pic
              groupId={this.props.groupId} 
              userId={this.props.userName}
            />
          </Col>

          <Col className='row gx-0' md={7}>
            <Message 
              groupId={this.props.groupId} 
              userId={this.props.userName}
              suserUid={this.props.suserUid}
            >
            </Message>
          </Col>

          <Col className='row gx-0' md={2}>
            <MetaPanel
              userName={this.props.userName.displayName}
              groupId={this.props.groupId} 
              userId={this.props.userName}
            >
            </MetaPanel>
          </Col>
        </Row>
      </Container>
    )
  }
}


const mapStateToProps = (state)=>({
  isLoading: state.user.isLoading,
  userName: state.user.currentUser,
  groupId: state.group.currentGroup,
  suserUid: state.suser.currentSuser,
})

export default connect(mapStateToProps, { setuser,clearuser })(App);