import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./NewElection.css";
import axios from 'axios';

export default class NewElection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      election_name: "",
      election_start_time: "",
      election_end_time: "",
      election_constituency: ""
    };
  }

  validateForm() {
    return this.state.election_name.length > 0 &&
           (new Date(this.state.election_end_time).getTime() > new Date(this.state.election_start_time).getTime());
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });
    //TODO : send new election data to backend
    console.log(new Date(this.state.election_start_time).toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    axios.post('http://election-red-server.herokuapp.com/elec/create', {"election_name": this.state.election_name,
                                                     "start_time": new Date(this.state.election_start_time).toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
                                                     "end_time": new Date(this.state.election_end_time).toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
                                                     "constituency": this.state.election_constituency,
                                                     "result": "--"})
         .then((response) => {
           console.log(response);
           this.props.history.push("/");
         })
         .catch(function (error){
           alert(error);
         });

    console.log(this.state.election_name);
  }

  render() {
    return (
      <div className="NewElection">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="election_name" bsSize="large">
            <ControlLabel>Election Name</ControlLabel>
            <FormControl
              autoFocus
              value={this.state.election_name}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="election_constituency" bsSize="large">
            <ControlLabel>Constituency</ControlLabel>
            <FormControl
              value={this.state.election_constituency}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="election_start_time" bsSize="large">
            <ControlLabel>Election Start Time</ControlLabel>
            <FormControl
              type="datetime-local"
              value={this.state.election_start_time}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="election_end_time" bsSize="large">
            <ControlLabel>Election end time</ControlLabel>
            <FormControl
              type="datetime-local"
              value={this.state.election_end_time}
              onChange={this.handleChange}
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating..."
          />
        </form>
      </div>
    );
  }
}
