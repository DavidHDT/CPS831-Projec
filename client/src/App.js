import React, { Component } from "react";
import CandyToken from "./contracts/CandyToken.json";
import CandyTokenSale from "./contracts/CandyTokenSale.json";
import KYC from "./contracts/KYC.json";
import getWeb3 from "./getWeb3";

import { Flex, Button } from "@chakra-ui/core";
import "./App.css";

class App extends Component {
  state = { loaded:false, kycAddress: "0x123...", tokenSaleAddress: null, userTokens:0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      console.log(this.networkId);
      this.CandyInstance = new this.web3.eth.Contract(
        CandyToken.abi,
        CandyToken.networks[this.networkId] && CandyToken.networks[this.networkId].address,
      );

      this.SaleInstance = new this.web3.eth.Contract(
        CandyTokenSale.abi,
        CandyTokenSale.networks[this.networkId] && CandyTokenSale.networks[this.networkId].address,
      );

      this.KYCInstance = new this.web3.eth.Contract(
        KYC.abi,
        KYC.networks[this.networkId] && KYC.networks[this.networkId].address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({loaded:true, tokenSaleAddress: CandyTokenSale.networks[this.networkId].address}, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  updateUserTokens = async () => {
    let userTokens = await this.CandyInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens});
  };

  listenToTokenTransfer = () => {
    this.CandyInstance.events.Transfer({to: this.accounts[0]}).on("data",this.updateUserTokens);
  };

  handleBuyTokens = async() => {
    await this.SaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.web3.utils.toWei("1","wei")});
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  handleKycWhitelisting = async () => {
    await this.KYCInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
    alert("KYC for "+this.state.kycAddress+" is completed");
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Flex justify="space-around" align="center" width="100%" padding="25px">
          <div className="App">

              <div className="overlay">

                <h1 className="title">Candy Shop</h1>

                <h2>Drop the receiving address down here:</h2>
                <input className="input-field" type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
                <br></br>
                <button className="button1" 
                onClick={this.handleKycWhitelisting}> Add Address to Whitelist
                  </button>


                <h2 class="Sub-Title">Buy Tokens</h2>
                <p id="wallet">You currently have: {this.state.userTokens} CDN</p>
 
                <button className="button2"
                  onClick={this.handleBuyTokens}>Buy more tokens
                </button>

                <p>If you want to buy tokens, send Wei to this address: {this.state.tokenSaleAddress}</p>


              </div>

              <div className="moving-background"></div>
          </div>
        </Flex>


    );
  }
}

export default App;
