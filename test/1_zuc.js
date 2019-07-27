const ZUCToken = artifacts.require('ZUCToken.sol');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

contract('ZUC Token Contract', async (accounts) => {

  it('Should correctly initialize constructor values of zuc Token Contract', async () => {
    
    this.tokenhold = await ZUCToken.new({from : accounts[0]});
  
  });

  it('Should check the Total Supply of ZUC Tokens', async () => {


  let totalSupply = await this.tokenhold.totalSupply();
  assert.equal(totalSupply/10**18,750*1000000); 
  });

  it('Should check the Name of a token of Zuc contract', async () => {

    let name = await this.tokenhold.name();
    assert.equal(name,'Zeuxcoin'); 

  });

  it('Should check the Symbol of a token of Zuc contract', async () => {

    let symbol = await this.tokenhold.symbol();
    assert.equal(symbol,'ZUC'); 

  });

  it('Should check the decimal of a token of ZUC contract', async () => {

    let decimal = await this.tokenhold.decimals();
    assert.equal(decimal.toNumber(),18); 

  });

  it('Should check the balance of a Owner of ZUC contract', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,750*1000000); 

  });

  it('Should Not be able to transfer tokens to accounts[1] without having token', async () => {

   try{
    let balanceOfSender = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfSender,0);
    await this.tokenhold.transfer(accounts[2],web3.utils.toHex(1*10**18), { from: accounts[1]});

   }catch(error){
    var error_ = 'Returned error: VM Exception while processing transaction: revert SafeMath: subtraction overflow -- Reason given: SafeMath: subtraction overflow.';
    assert.equal(error.message, error_, 'Reverted ');
   }

  });

  it('Should be able to transfer tokens to accounts[1]', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,750*1000000);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiary,0); 
    await this.tokenhold.transfer(accounts[1],web3.utils.toHex(10*10**18), { from: accounts[0]});
    let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater/10**18,749999990);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiaryLater/10**18,10); 

  });
  
  it("should Approve address[3] to spend specific token on the behalf of owner", async () => {
  
    this.tokenhold.approve(accounts[3], web3.utils.toHex(60*10**18), { from: accounts[0] });
    let allowance = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
    assert.equal(allowance/10**18,60, "allowance is wrong when approve");
  
  });

    it("should increase the allowance", async () => {

    let allowance = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
    assert.equal(allowance / 10 ** 18, 60, "allowance is wrong when approve");
    await this.tokenhold.increaseAllowance(accounts[3], web3.utils.toHex(40*10**18), { from: accounts[0] });
    let allowanceLater = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
    assert.equal(allowanceLater / 10 ** 18, 100, "allowance is wrong when approve");
  });

  it("should decrease the allowance", async () => {

    let allowance = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
    assert.equal(allowance / 10 ** 18, 100, "allowance is wrong when approve");
    await this.tokenhold.decreaseAllowance(accounts[3], web3.utils.toHex(10*10**18), { from: accounts[0] });
    let allowanceLater = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
    assert.equal(allowanceLater / 10 ** 18, 90, "allowance is wrong when approve");
  });

    it('Should Not be able to transfer tokens to accounts[3] it self after approval from accounts[0] more then allowed', async () => {

    try{
          let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,749999990);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfBeneficiary/10**18,0); 
    await this.tokenhold.transferFrom(accounts[0],accounts[3],web3.utils.toHex(100*10**18), { from: accounts[3]});
    }catch(error){

    var error_ = 'Returned error: VM Exception while processing transaction: revert SafeMath: subtraction overflow -- Reason given: SafeMath: subtraction overflow.';
    assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it('Should be able to burn tokens that is allowed to transfer', async () => {
    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,749999990);
    await this.tokenhold.burnFrom(accounts[0],web3.utils.toHex(10*10**18), { from: accounts[3]});
     
  });

  it('Should check the Total Supply of ZUC Tokens after burn approved tokens', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply/10**18,749999990); 
    });

  it('Should be able to transfer tokens to accounts[3] it self after approval from accounts[0]', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner/10**18,749999980);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfBeneficiary/10**18,0); 
    await this.tokenhold.transferFrom(accounts[0],accounts[3],web3.utils.toHex(40*10**18), { from: accounts[3]});
    let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater/10**18,749999940);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfBeneficiaryLater/10**18,40);
  });
    

  it('Should be able to burn tokens', async () => {

    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfBeneficiaryLater/10**18,40);
    await this.tokenhold.burn(web3.utils.toHex(40*10**18), { from: accounts[0]});
  });

  it('Should check the Total Supply of ZUC Tokens after burn', async () => {


    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply/10**18,749999950); 
    });


})

