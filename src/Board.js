import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

const LANE_KEYS = {
  backlog: 'backlog',
  inProgress: 'in-progress',
  complete: 'complete',
};

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: this.getClients(),
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
    this.laneOrder = Object.keys(this.swimlanes);
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: LANE_KEYS.backlog,
    }));
  }

  componentDidMount() {
    const containers = this.laneOrder.map((laneName) => this.swimlanes[laneName].current);
    this.drake = Dragula(containers);
    this.drake.on('drop', (element, target, source, sibling) => {
      this.handleDrop(element, target, source, sibling);
    });
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
    }
  }

  getLaneClients(laneName) {
    return this.state.clients.filter((client) => client.status === LANE_KEYS[laneName]);
  }

  getLaneNameByContainer(container) {
    return this.laneOrder.find((laneName) => this.swimlanes[laneName].current === container);
  }

  handleDrop(element, target, source, sibling) {
    if (!target) {
      return;
    }

    const clientId = element.dataset.id;
    const sourceLane = this.getLaneNameByContainer(source);
    const targetLane = this.getLaneNameByContainer(target);

    if (!clientId || !sourceLane || !targetLane) {
      return;
    }

    const orderedTargetIds = Array.from(target.children).map((child) => child.dataset.id);

    this.setState((currentState) => {
      const clients = currentState.clients.map((client) => {
        if (client.id !== clientId) {
          return client;
        }

        return {
          ...client,
          status: LANE_KEYS[targetLane],
        };
      });

      const nextClients = [];
      this.laneOrder.forEach((laneName) => {
        const laneStatus = LANE_KEYS[laneName];
        const laneClients = clients.filter((client) => client.status === laneStatus);

        if (laneName === targetLane) {
          orderedTargetIds.forEach((id) => {
            const matchingClient = laneClients.find((client) => client.id === id);
            if (matchingClient) {
              nextClients.push(matchingClient);
            }
          });
          return;
        }

        laneClients.forEach((client) => {
          nextClients.push(client);
        });
      });

      return {
        clients: nextClients,
      };
    });
  }

  renderSwimlane(name, laneName, ref) {
    return (
      <Swimlane
        name={name}
        clients={this.getLaneClients(laneName)}
        dragulaRef={ref}
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', 'backlog', this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', 'inProgress', this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', 'complete', this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
