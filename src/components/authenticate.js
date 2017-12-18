import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

//This function receives the Component that only logged in users should access
export default function requireLogin(ComponentPassed){
    class AllowedComponent extends Component {
        componentWillMount(){
            let token = window.localStorage.getItem('token')
            if(!token){
                this.props.history.push("/auth/login/");
            }
        }
        render(){
            // Pass props to the component
            return <ComponentPassed {...this.props}/>
        }
    }
    //Return the new Component that requires authorization
    return withRouter(AllowedComponent);
}