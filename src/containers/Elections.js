import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { LinkContainer } from "react-router-bootstrap";
import axios from 'axios';
import "./Elections.css";

export default class Elections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      election_id:"",
      election_name: "",
      constituency: "",
      start_time: "",
      end_time: "",
      candidates: []
    };
  }

  componentDidMount() {

    if (!this.props.isAuthenticated) {
      return;
    }

    this.setState({ election_id: this.props.match.params.id });

    try {
      axios.get("https://election-red-server.herokuapp.com/elec/"+this.props.match.params.id)
           .then((response) => {
             console.log(response.data);
             this.setState({election_name : response.data.election_name});
             this.setState({constituency : response.data.constituency});
             this.setState({start_time : response.data.start_time});
             this.setState({end_time : response.data.end_time});
             this.setState({candidates : response.data.candidates});
           });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.props.history.push("/add/candidate/:id");
  }

  renderCandidatesList(elec) {
    return [{}].concat(elec).map(
      (election, i) =>
        i !== 0
          ?
          <ListGroupItem header={election.name}>
              {"Party: " + election.party_name}
              <br />
              {"Votes: " + election.vote_count}
            </ListGroupItem>
          : null
    );
  }

  renderCandidates() {
    return (
      <div className="candidates">
        <ListGroup>
          {!this.state.isLoading && this.renderCandidatesList(this.state.candidates)}
        </ListGroup>
      </div>
    );
  }

  renderAddCandidateButton(){
    return (
      <LinkContainer
          key={this.state.election_id}
          to={"/add/candidate/"+this.state.election_id}
      >
        <LoaderButton
          block
          bsSize="large"
          type="submit"
          isLoading={this.state.isLoading}
          text="Add candidates"
          loadingText="Adding"
        />
      </LinkContainer>
    );
  }

  render() {
    return (
      <div className="Elections">
        <PageHeader>{this.state.election_name}</PageHeader><br />
        <div className="constituency">
        <div className="key">Constituency</div>
        <div className="value">{this.state.constituency}</div>
        </div>
        <div className="time">
          <div className="key">Start Time</div>
          <div className="value">{new Date(this.state.start_time).toLocaleString()}</div>
          <div className="key">End Time</div>
          <div className="value">{new Date(this.state.end_time).toLocaleString()}</div>
        </div>
        <br />
        {this.renderCandidates()}
        {
          (new Date(this.state.start_time).getTime() > new Date().getTime()) &&
          this.renderAddCandidateButton()
        }
      </div>
    );
  }
}
