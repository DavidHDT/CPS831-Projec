const Token = artifacts.require("./FruitsToken.sol");

var chai = require("chai");
var chaiPromise = require("chai-as-promised");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);

chai.use(chaiBN);
chai.use(chaiPromise);

const expect = chai.expect;

contract("TokenTest", async (accounts) => {
  it("verify existing tokens in owner account", async () =>{
    let model = await Token.deployed();
    let totalSupply = await model.totalSupply();
    expect(model.balanceOf(accounts[0])).to.eventually.be.a.bignumber.equal(totalSupply);
  })


  it("is the balance correct after sending tokens", async () => {
    const sendAmount = 1;
    let model = await Token.deployed();
    let totalSupply = await model.totalSupply();
    expect(model.transfer(accounts[1], sendAmount)).to.eventually.be.fulfilled;
    let recipientBalance = await model.balanceOf(accounts[1]);
    expect(model.balanceOf(accounts[0])).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendAmount)));
    expect(model.balanceOf(accounts[1])).to.eventually.be.a.bignumber.equal(recipientBalance + sendAmount);
  })

  it("sending more tokens than current balance", async () => {
    let model = await Token.deployed();
    let ownerBalance = await model.balanceOf(accounts[0]);
    expect(model.transfer(accounts[1], ownerBalance + 1)).to.eventually.be.rejected;
  })
});
