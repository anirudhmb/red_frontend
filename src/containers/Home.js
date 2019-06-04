import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from 'axios';
import "./Home.css";

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      elections: [],
      upcoming:[],
      onGoing: [],
      past:[]
    };
  }



  componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      axios.get("http://election-red-server.herokuapp.com/elec")
           .then((response) => {
             this.setState({elections : response.data});
             console.log(response.data);
             var sortResult = this.state.elections;
             sortResult.sort(function(a,b){
               return new Date(b.start_time) - new Date(a.start_time);
             });
             console.log(sortResult);
             this.setState({elections : sortResult});

             var result = sortResult.filter(function(a){
               return (new Date(a.start_time).getTime() > new Date().getTime());
             });
             this.setState({upcoming : result});
             console.log(this.state.upcoming);

             result = sortResult.filter( function (a) {
               return ((new Date(a.end_time).getTime() > (new Date().getTime())) && (new Date(a.start_time).getTime() <= (new Date().getTime())));
             });
             this.setState({onGoing : result});
             console.log(this.state.onGoing);

             result = sortResult.filter( function (a) {
               return (new Date(a.end_time).getTime() < (new Date().getTime()));
             });
             this.setState({past : result});
             console.log(this.state.past);
           });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }

  renderElectionsList(elec) {
    return [{}].concat(elec).map(
      (election, i) =>
        i !== 0
          ? <LinkContainer
              key={election._id}
              to={`/elections/${election._id}`}
            >
              <ListGroupItem header={election.election_name}>
                {"Constituency: " + election.constituency}
                <br />
                {"Start Time: " + election.start_time}
                <br />
                {"End Time: " + election.end_time}
              </ListGroupItem>
            </LinkContainer>
          : null
    );
  }



  renderLander() {
    return (
      <div className="lander">
        <h1>ECP</h1>
        <p>The Election Comission Portal Homepage</p>
      </div>
    );
  }

  renderElections() {
    return (
      <div className="elections">
        <PageHeader>Elections List</PageHeader>
        <ListGroup>
          {<h2>Upcoming</h2>}
          {!this.state.isLoading && this.renderElectionsList(this.state.upcoming)}
        </ListGroup>
        <br />
        {<h2>Ongoing</h2>}
        <ListGroup>
          {!this.state.isLoading && this.renderElectionsList(this.state.onGoing)}
        </ListGroup>
        <br />
        {<h2>Past</h2>}
        <ListGroup>
          {!this.state.isLoading && this.renderElectionsList(this.state.past)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderElections() : this.renderLander()}
      </div>
    );
  }
}
