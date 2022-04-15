var CandyToken = artifacts.require("./CandyToken.sol");
var CandyTokenSale = artifacts.require("./CandyTokenSale.sol");
var KYC = artifacts.require("./KYC.sol");
require("dotenv").config({path: "../.env"});

module.exports = async function(deployer) {
  let address = await web3.eth.getAccounts();
  await deployer.deploy(CandyToken);
  await deployer.deploy(KYC);
  await deployer.deploy(CandyTokenSale, process.env.RATE, address[0], CandyToken.address, KYC.address);
  let TokenInstance = await CandyToken.deployed();
  let SaleInstance = await CandyTokenSale.deployed();
  await TokenInstance.addMinter(SaleInstance.address);
  await TokenInstance.renounceMinter();

};
