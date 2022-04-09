import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import { Component } from 'react/cjs/react.production.min';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth } from '@firebase/auth';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/main';

const store = createStore(rootReducer,composeWithDevTools())

class Routing extends Component{
    state={
        tracker: false
      }
      componentDidMount(){
        getAuth().onAuthStateChanged((user)=> {
          if (user) {
            this.setState({tracker: true})
          } else {
            this.setState({tracker: false})
          }
        });
      }
    render(){
      // console.log();
        return(
            <Router>
                {this.state.tracker ?
                  <Routes>
                    <Route path="/" element={<App />} ></Route>
                    <Route path="/register" element={<Navigate to="/" />} ></Route>
                    <Route path="/login" element={<Navigate to="/" />} ></Route>
                  </Routes>
                :
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" />} ></Route>
                    <Route path="/register" element={<Register />} ></Route>
                    <Route path="/login" element={<Login />} ></Route>
                  </Routes>
                }
            </Router>
        )
    }
}


ReactDOM.render(<Provider store={store}><Routing /></Provider>,document.getElementById('root'));