import React, { Component } from 'react';
import truffleContract from 'truffle-contract';

import getWeb3 from './utils/getWeb3';
import Hermes from './hermesjs/index';

import SimpleStorageContract from './contracts/SimpleStorage.json';

import './App.css';

class App extends Component {
  state = { value: 0, contractValue: 0, web3: null, accounts: null, contract: null, hermes: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      const hermes = new Hermes(web3.currentProvider);
      await hermes.initialize();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, hermes }, this.fetchValue);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.log(error);
    }
  };

  fetchValue = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.get();

    // Update state with the result.
    this.setState({ contractValue: response.toNumber() });
  };

  onChangeSafe = async (e) => {
    await this.state.hermes.setSafeAddress(e.target.value);
  };

  onChange = async (e) => {
    this.setState({ value: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { accounts, contract } = this.state;

    let data = contract.contract.methods.set(this.state.value).encodeABI();
    const gasPrice = this.state.web3.utils.toWei('10', 'gwei')
    const reward = 20

    await this.state.hermes.sendMessage(
      contract.address,
      0,
      data,
      0,
      0
    );
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <img
          className="eth-logo"
          src="https://cdn.iconscout.com/icon/free/png-512/ethereum-15-646027.png"
        />
        <h1 className="title">Hermes, The Executor :)</h1>
        <h2 className="subtitle">Layer 2 execution market</h2>
        <form className="value-form" onSubmit={this.onSubmit}>
          <input
            className="form__field"
            type="text"
            name="value"
            onChange={this.onChangeSafe}
            placeholder="Safe-contract address"
            autoComplete="off"
          />
        <input
            id="value-input"
            className="form__field"
            type="text"
            name="value"
            onChange={this.onChange}
            placeholder="Set new stored value"
            autoComplete="off"
          />
          <input className="btn" type="submit" value="Submit" />
        </form>
        <div className="indicator">The on-chain stored value is: {this.state.contractValue}</div>
      </div>
    );
  }
}

export default App;
