import React, { Component } from 'react';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from './utils/getWeb3';
import truffleContract from 'truffle-contract';

import './App.css';

class App extends Component {
  state = { value: 0, contractValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.fetchValue);
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
    this.setState({ safe: e.target.value });
  };

  // onSubmitSafe = async (e) => {
  //   e.preventDefault();
  //   const { accounts, contract } = this.state;

  //   // await contract.set(this.state.safe, { from: accounts[0] });
  //   // const response = await contract.get();
  //   // this.setState({ contractValue: response.toNumber() });
  // };

  onChange = async (e) => {
    this.setState({ value: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { accounts, contract } = this.state;

    await contract.set(this.state.value, { from: accounts[0] });
    const response = await contract.get();
    this.setState({ contractValue: response.toNumber() });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Hermes Network</h1>
        <h2>Try out Hermes the Executor</h2>
        <form onSubmit={this.onSubmitSafe}>
          <label>
            Your Safe address:
            <input type="text" name="value" onChange={this.onChangeSafe} />
          </label>
          {/* <input type="submit" value="Submit" /> */}
        </form>
        <form onSubmit={this.onSubmit}>
          <label>
            Desired value:
            <input type="text" name="value" onChange={this.onChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div>The on-chain stored value is: {this.state.contractValue}</div>
      </div>
    );
  }
}

export default App;
