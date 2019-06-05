import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from 'axios';
import "./Home.css";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

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
               console.log(new Date(a.start_time).getMinutes());
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
        <Tabs>

          <TabList>
            <Tab>Upcoming</Tab>
            <Tab>OnGoing</Tab>
            <Tab>Past</Tab>
          </TabList>

          <TabPanel>
            <ListGroup>
              {!this.state.isLoading && this.renderElectionsList(this.state.upcoming)}
            </ListGroup>
          </TabPanel>

          <TabPanel>
            <ListGroup>
              {!this.state.isLoading && this.renderElectionsList(this.state.onGoing)}
            </ListGroup>
          </TabPanel>

          <TabPanel>
            <ListGroup>
              {!this.state.isLoading && this.renderElectionsList(this.state.past)}
            </ListGroup>
          </TabPanel>

        </Tabs>
      </div>
    );
  }


  //Actual render

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderElections() : this.renderLander()}
      </div>
    );
  }


// render(){
//   return (
//     <div className="Home">
//       <Tabs>
//       <TabList>
//         <Tab>Upcoming</Tab>
//         <Tab>Title 2</Tab>
//       </TabList>
//
//       <TabPanel>
//         <h2>Any content 1</h2>
//       </TabPanel>
//       <TabPanel>
//         <h2>Any content 2</h2>
//       </TabPanel>
//     </Tabs>
//   </div>
//   );
// }

}
