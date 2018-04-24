// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const ETHWallet = require('../sdkbox/ethwallet/ethwallet');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        infoLabel: {
            default: null,
            type: cc.Label
        },
        coinDigit: {
            default: null,
            type: cc.Label
        },
        addressLabel: {
            default: null,
            type: cc.Label
        },
        banlanceButton: {
            default: null,
            type: cc.Button
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.PROVIDER_URL = 'https://ropsten.infura.io/L3BRNAgKihyPmcyI1ESe';
        this.DEVELOPER_ADDRESS = '0x865aE9B9f6FE5A59EA9664C9c8507F50679Ddf7D';

        this.logs = []; 
        this.initSBPay();

        this.coin = parseInt(cc.sys.localStorage.getItem('coin'));
        if (!this.coin) {
            this.coin = 0;
        }
        this.updateCoin();
    },

    // update (dt) {},

    initSBPay() {
        let ethwallet = new ETHWallet();
        this.log(`ETHWallet version: ${ethwallet.version.versionName}`);
        if (ethwallet.init(this.PROVIDER_URL)) {
            this.log('ETHWallet init success');
        } else {
            this.log('ETHWallet init failed');
            return;
        }

        this.ethwallet = ethwallet;
        this.loadAddress();
    },

    onCheckBalance() {
        let self = this;
        this.ethwallet.getBalance(function(result){
            self.log(JSON.stringify(result));
            self.banlanceButton.getComponentInChildren(cc.Label).string = `Check Ether:${result.balance}`;
        }, this.acc.address);
    },

    onTransToCoin() {
        let self = this;
        this.ethwallet.remit(function(result) {
            self.log(JSON.stringify(result));

            if (result.error) {
                return;
            }
            if (6 == result.confirmationNumber) {
                // result.value's unit is wei
                // 1 Ether = 1000000000000000000(10^18) wei
                // 1 Ether = 10000(10^4) Coin
                let tempCoin = result.value / 100000000000000; //same as result.value / 1000000000000000000 * 10000
                self.coin += Math.ceil(tempCoin);
                self.updateCoin();
            }
        }, this.DEVELOPER_ADDRESS);
    },

    updateCoin() {
        this.coinDigit.string = this.coin;

        cc.sys.localStorage.setItem("coin", this.coin.toString());
    },

    loadAddress() {
        let ethwallet = this.ethwallet;
        let pw = 'password';
        let acc = ethwallet.newAccountIf(pw);
        pw = null;

        this.log(`address: ${acc.address}`);
        this.addressLabel.string = acc.address;
        this.acc = acc;
    },

    log(...args) {
        //cc.log(args);
        console.log(...args);

        if (this.logs.push(args) > 2) {
            this.logs.shift();
        }
        this.infoLabel.string = this.logs.toString().replace(',', '\n');
    }

});
