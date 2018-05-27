// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import { h, Component } from 'preact';
import compat from 'preact-compat';
import classNames from 'classnames';
import Modal from './modal';

import ProjectEditor from './projecteditor';
import {Wallet} from './projecteditor/wallet';

import Solc from './solc';
import EVM from './evm';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.idCounter=0;

        this._version="1.0-beta19";
        this.session={
            start_time: Date.now(),
        };

        // Map network to endpoint.
        const endpoints = {
            browser: {
                endpoint: "http://superblocks-browser",
                chainId: undefined,
                interval: 1000,
            },
            local: {
                endpoint: "http://localhost:8545/",
                chainId: undefined,
                interval: 2000,
            },
            infuranet: {
                endpoint: "https://infuranet.infura.io/",
                chainId: 5810,
                interval: 5000,
            },
            kovan: {
                endpoint: "https://kovan.infura.io/",
                chainId: 42,
                interval: 5000,
            },
            mainnet: {
                endpoint: "https://mainnet.infura.io/",
                chainId: 1,
                interval: 10000,
            },
            ropsten: {
                endpoint: "https://ropsten.infura.io/",
                chainId: 3,
                interval: 2500,
            },
            rinkeby: {
                endpoint: "https://rinkeby.infura.io/",
                chainId: 4,
                interval: 2500,
            },
        };

        this.functions = {
            modal: {
                show: this.showModal,
                close: this.closeModal,
                cancel: this.cancelModal,
                getCurrentIndex: this.getCurrentModalIndex,
            },
            session: {
                start_time: this.session_start_time,
            },
            networks: {
                endpoints: endpoints,
            },
            generateId: this.generateId,
        };
        this.knownWalletSeed="butter toward celery cupboard blind morning item night fatal theme display toy";
        this.functions.wallet = new Wallet({functions: this.functions, length:30});
        // The development wallets seed is well known and the first few addresses are seeded
        // with ether in the genesis block.
        this.functions.wallet.openWallet("development", this.knownWalletSeed);
        this.setState({modals:[]});
        console.log("Known development Ethereum wallet seed is: "+this.knownWalletSeed);

        this._init();
    }

    _init=()=>{
        const modalData={
            title: "Loading Superblocks Studio " + this._version,
            body: "Initializing Solidity compiler and Ethereum Virtual Machine...",
            style: {width:"528px","background-color":"#73618b",color:"#fef7ff"},
        };
        const modal=(<Modal data={modalData} />);
        this.functions.modal.show({cancel: ()=>{return false}, render: () => {return modal;}});
        this.functions.compiler=new Solc({id:this.generateId()});
        this.functions.EVM=new EVM({id:this.generateId()});
        const fn=()=>{
            if(this.functions.EVM.isReady() && this.functions.compiler.isReady()) {
                console.log("Superblocks Studio "+this._version+" Ready.");
                this.functions.modal.close();
            }
            else {
                setTimeout(fn,1000);
            }
        };
        fn();

        // Solely for Ivan on Tech's Academy course
        this._showIotAcademyWelcome=true;
        setTimeout(()=>{
            this._showIotAcademyWelcome=false;
            this.setState();
        }, 60000);
    };

    //_checkVersion=()=>{
        //const self=this;
        //fetch('/manifest.json', {cache: 'no-cache'})
            //.then(function(response) {
                //if(response.ok) return response.json();
                //else alert("Could not load manifest.json.");
            //})
            //.then(function(manifest) {
                //if(manifest.version!=self._version) {
                    //alert("This is not the newest version, hard reload your browser to make it fetch the newest version of Studio.");
                //}
            //});
    //};

    session_start_time = ()=>{
        return this.session.start_time;
    };

    generateId = () => {
        return ++this.idCounter;
    };

    getClassNames = () => {
        return classNames({
            'modals':  this.state.modals.length>0
        });
    };

    getCurrentModalIndex = () => {
        return this.state.modals.length-1;
    };

    showModal = (modal) => {
        this.state.modals.push(modal);
        this.setState();
    };

    closeModal = (index) => {
        if(index==null) index=this.state.modals.length-1;
        var modal=this.state.modals[index];
        this.state.modals.splice(index,1);
        this.setState();
    };

    getModal = () => {
        return this.state.modals.map((elm, index) => {
            const stl={position: "absolute"};
            stl["z-index"] = index;
            if(index<this.state.modals.length-1) stl["opacity"] = "0.33";
            return (<div id={"app_modal_"+index} style={stl} class="full" onClick={this.modalOutside}>{elm.render()}</div>);
        });
    };

    cancelModal = (e) => {
        if(e) { e.preventDefault(); e.stopPropagation(); }
        const index=this.state.modals.length-1;
        var modal=this.state.modals[index];
        if(modal.cancel && modal.cancel(modal)===false) return;
        this.state.modals.splice(index,1);
        this.setState();
    };

    modalOutside = (e) => {
        if(e) { e.preventDefault(); e.stopPropagation(); }
        if(e.target.id.indexOf("app_modal")===0) {
            this.cancelModal();
        }
    };

    render() {
        const modalContent = this.getModal();
        return (
            <div id="app" className={this.getClassNames()}>
                <div id="app_content">
                    <div class="top-menu">
                        <span class="left">Superblocks Studio {this._version} (Asparagus)</span>
                        <span class="right">Need help? <a href="https://t.me/GetSuperblocks" target="_blank">Join us on Telegram!</a></span>
                        { this._showIotAcademyWelcome && (<span id="iot-academy-blurb" class="right">Use this version for Ivan on Tech's academy course, else <a href="https://studio.superblocks.com" target="_blank">try the newest version</a></span>)}
                    </div>
                    <div class="maincontent">
                        <ProjectEditor key="projedit" functions={this.functions} />
                    </div>
                </div>
                <div id="app_modal" onClick={this.modalOutside}>
                    {modalContent}
                </div>
            </div>
        );
    }
}
