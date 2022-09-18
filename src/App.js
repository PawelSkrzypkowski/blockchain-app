import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import {WRAPPER_ABI, WRAPPER_CONTRACT_ADDRESS, VOTE_ABI} from "./blockchainConfig";
import web3 from "web3";
import DtPicker  from 'react-calendar-datetime-picker';
import 'react-calendar-datetime-picker/dist/index.css';
import './bootstrap.min.css';
import {Button, Form} from "react-bootstrap";

class App extends Component {

  componentDidMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    let web3Instance;
    if (window.ethereum) {
      web3Instance = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      web3Instance = new Web3(window.web3.currentProvider);
    } else {
      // If no injected web3 instance is detected, fallback to Ganache.
      App.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3Instance = new Web3(App.web3Provider);
    }
    const accounts = await web3Instance.eth.getAccounts();
    let contract = new web3Instance.eth.Contract(WRAPPER_ABI, WRAPPER_CONTRACT_ADDRESS);
    let activeVotingCount = await contract.methods.getAllActiveVotingCount().call();
    let finishedVotingCount = await contract.methods.getAllFinishedVotingCount().call();
    this.setState({ account: accounts[0], activeVotingCount: activeVotingCount,
      finishedVotingCount: finishedVotingCount, web3Instance: web3Instance});
    await this.loadActiveRows();
  }

  async loadActiveRows() {
    let rows = '';
    for (let i = 0; i < this.state.activeVotingCount; i++) {
      let wrapperContract = new this.state.web3Instance.eth.Contract(WRAPPER_ABI, WRAPPER_CONTRACT_ADDRESS);
      let votingAddress = await wrapperContract.methods.getActiveVoting(i).call();
      let contract = new this.state.web3Instance.eth.Contract(VOTE_ABI, votingAddress);
      let betUTCTime = await contract.methods.betUTCTime().call();
      let betFinalPrice = await contract.methods.betFinalPrice().call();
      let singleBetValue = await contract.methods.singleBetValue().call();
      let totalBetsValue = await contract.methods.totalBetsValue().call();
      let totalBets = await contract.methods.totalBets().call();
      rows = rows + '\n' + 'time: ' + betUTCTime + ", finalPrice: " + betFinalPrice + ', single bet value: ' +
          singleBetValue + ', total bets value: ' + totalBetsValue + ', number of bets: ' + totalBets;
    }
    this.setState({activeVotingRows: rows});
  }

  deployContract = async event => {
    event.preventDefault();
    let contract = new this.state.web3Instance.eth.Contract(WRAPPER_ABI, WRAPPER_CONTRACT_ADDRESS);
    await contract.methods.addNewVoting(this.state.betValue * 10 && 18, this.state.betTime)
        .send({from: this.state.account});
  }

  constructor(props) {
    super(props)
    this.state = {account: '', activeVotingCount: -1, finishedVotingCount: -1,
      web3Instance: null, betValue: -1, betTime: -1, activeVotingRows: ''}
  }

  handleBetValue = event => {
    this.setState({betValue: event.target.value});
  }

  handleBetTime = event => {
    console.log(event)
    if (event === undefined) {
      return;
    }
    let date = new Date(event.year, event.month, event.day, event.hour, event.minute);
    this.setState({betTime: date.getTime()});
  }

  render() {
    return (
        <div className="container">
          <h1>Secret Price Voting Dapp</h1>
          <Form onSubmit={this.deployContract}>
            <Form.Group className="mb-3" controlId="formBetValue">
              <Form.Label>Single bet value in ETH</Form.Label>
              <Form.Control type="number" step="0.01" min="0" placeholder="0.1 ETH"
                            onChange={this.handleBetValue} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBetTime">
              <Form.Label>Bet time in millis UTC</Form.Label>
              <DtPicker
                  onChange={this.handleBetTime}
                  type='single'
                  local='en'
                  withTime
                  showWeekend
                  showTimeInput
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <p>Active voting: {this.state.activeVotingCount}</p>
          <p>{this.state.activeVotingRows}</p>
          <p>Finished voting: {this.state.finishedVotingCount}</p>
        </div>
    );
  }
}

export default App;