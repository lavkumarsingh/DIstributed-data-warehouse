import React, { Component } from "react";
import IpfsLink from "./contracts/IpfsLink.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs'
import "./App.css";

class App extends Component {

  componentDidMount = async () => {
   try {
     const web3 = await getWeb3();

     const accounts = await web3.eth.getAccounts();

     const networkId = await web3.eth.net.getId();
     const deployedNetwork = IpfsLink.networks[networkId];
     const instance = new web3.eth.Contract(
       IpfsLink.abi,
       deployedNetwork && deployedNetwork.address,
     );

     this.setState({ web3, accounts, contract: instance });

     //***********************************************//
     const response = await this.state.contract.methods.get().call();
     // Update state with the result.
     this.setState({ ethIpfsHash: response });
     console.log(this.state.ethIpfsHash);
     //***********************************************//

    } catch (error) {
     alert(
       `Failed to load web3, accounts, or contract. Check console for details.`,
     );
     console.error(error);
   }
 };
 
 
  constructor(props) {
    super(props)

    this.state = {
      buffer: null,
      ipfsHash: null,
      ethIpfsHash: null,
      web3: null, 
      accounts: null, 
      contract: null
    }
  }

 
 
 
 
    captureFile = (event) => {
      event.preventDefault()
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
        this.setState({ buffer: Buffer(reader.result) })
      }
      console.log(this.state.ethIpfsHash);
    }
 
    onSubmit = async(event) => {
      event.preventDefault()
      const result = await ipfs.add(this.state.buffer)
      this.setState({ ipfsHash: result.path })
      await this.state.contract.methods.set(this.state.ipfsHash).send({ from: this.state.accounts[0] });

      const response = await this.state.contract.methods.get().call();

      // Update state with the result.
      this.setState({ ethIpfsHash: response });
    }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>File Cloud</h1>
        <img src={ `https://ipfs.infura.io/ipfs/`+this.state.ethIpfsHash} alt=""/>
        <form onSubmit={this.onSubmit} >
          <input type='file' onChange={this.captureFile} />
          <input type='submit' />
        </form>
      </div>
    );
  }
}

export default App;
