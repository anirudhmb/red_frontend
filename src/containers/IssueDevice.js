import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./IssueDevice.css";
import axios from 'axios';

export default class IssueDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      adhaar_card_number: "",
      device_id: ""
    };
  }

  validateForm() {
    return this.state.adhaar_card_number > 0 && this.state.device_id.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    axios.post('http://user-red-server.herokuapp.com/user/alloc', {"adhaar":this.state.adhaar_card_number, "device_id":this.state.device_id})
         .then((response) => {
           console.log(response);
           this.props.history.push("/");
         })
         .catch(function (error){
           alert(error);
         });
    console.log(this.state.adhaar_card_number+"   "+this.state.device_id);
  }

  render() {
    return (
      <div className="IssueDevice">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="adhaar_card_number" bsSize="large">
            <ControlLabel>Adhaar Card Number</ControlLabel>
            <FormControl
              autoFocus
              value={this.state.adhaar_card_number}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="device_id" bsSize="large">
            <ControlLabel>Device Id</ControlLabel>
            <FormControl
              value={this.state.device_id}
              onChange={this.handleChange}
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Issue New Device"
            loadingText="Issuing…"
          />
        </form>
      </div>
    );
  }
}
