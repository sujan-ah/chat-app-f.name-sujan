import React, { Component } from 'react';
import { Card,InputGroup,Form,FormControl,Row,Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar,faSearch } from '@fortawesome/free-solid-svg-icons';

export default class MessageHeader extends Component {
    render() {
        return (
            
            <Card >
                <Row border="dark" style={{ width: "100%",marginTop: 20, }}>
                    <Col style={{marginLeft: 10}}>
                        <h4>
                            Group
                        </h4>
                        <FontAwesomeIcon style={{fontSize: 40}} icon={faStar} />
                        <h6 style={{marginTop: 40}}>
                            {this.props.totaluser.length > 1
                                ? `${this.props.totaluser.length} Users`
                                :`${this.props.totaluser.length} User`
                            }
                        </h6>
                    </Col>
                    
                    <Col >
                        <InputGroup style={{width: 300, marginLeft: 250}}>
                            <InputGroup.Text>
                                <FontAwesomeIcon  icon={faSearch} />
                            </InputGroup.Text>
                            <FormControl
                                onChange={this.props.handleSearchChange}
                                type="search" 
                                placeholder="search message"
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </Card>
                
            
            
        )
    }
}
