import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./AddCandidate.css";
import axios from 'axios';

export default class AddCandidate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      adhaar_card_number: "",
      election_id: "",
      candidate_id:"",
      name:"",
      party_name:"",
      party_symbol:"",
      isValid:false
    };
  }

  componentDidMount() {
    console.log(this.props.match.params.id);
    this.setState({ election_id: this.props.match.params.id });
  }

  validateForm() {
    return this.state.adhaar_card_number.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    if(this.state.isValid === false){
      axios.post('http://user-red-server.herokuapp.com/user/find', {"adhaar":this.state.adhaar_card_number})
           .then((response) => {
              console.log(response.data);
              this.setState({ isLoading: false });
              console.log(Object.keys(response.data).length);
              if(Object.keys(response.data).length > 0){
                console.log(response.data[0].name);
                this.setState({ isValid: true });
                this.setState({ candidate_id: response.data[0]._id });
                this.setState({ name: response.data[0].name });
              } else {
                alert("No person with the corresponding adhaar card number.");
              }
           })
           .catch(function (error){
             alert(error);
           });
    } else {
      axios.post('http://election-red-server.herokuapp.com/elec/nomination', {"election_id":this.state.election_id, "candidate":{"_id":this.state.candidate_id,"name":this.state.name,"party_name":this.state.party_name,"party_symbol":this.state.party_symbol,"vote_count":0}})
           .then((response) => {
             console.log(response);
           })
           .catch(function (error){
             alert(error);
           });
           this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="AddCandidate">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="adhaar_card_number" bsSize="large">
            <ControlLabel>Adhaar Card Number</ControlLabel>
            <FormControl
              autoFocus
              value={this.state.adhaar_card_number}
              onChange={this.handleChange}
            />
          </FormGroup>
          {this.state.isValid &&
            <div>
              <FormGroup controlId="name" bsSize="large">
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  disabled
                  value={this.state.name}
                />
              </FormGroup>
              <FormGroup controlId="party_name" bsSize="large">
                <ControlLabel>Party</ControlLabel>
                <FormControl
                  value={this.state.party_name}
                  onChange={this.handleChange}
                  componentClass="select">
                  <option key="BJP">BJP</option>
                  <option key="Congress">Congress</option>
                  <option key="Independent">Independent</option>
                </FormControl>
              </FormGroup>
              <FormGroup controlId="party_symbol" bsSize="large">
                <ControlLabel>Party Symbol</ControlLabel>
                <FormControl
                  value={this.state.party_symbol}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </div>
          }
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Add Candidate"
            loadingText="Validating..."
          />
        </form>
      </div>
    );
  }
}
