// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import { h, Component } from 'preact';
import Proptypes from 'prop-types';
import classNames from 'classnames';
import style from './style';
import ModalHeader from '../../../modal/modalHeader';

export default class SettingsModal extends Component {

    state = {
        projectTitle: ""
    }

    onCloseClickHandle = () => {
        this.props.onCloseClick();
    };

    handleTitleChange = (e) => {
        const title = e.target.value;
        this.setState({
            projectTitle: e.target.value,
        });
    }

    onCreateProjectHandle = () => {
        if (this.state.positiveMatch) {
            this.props.onDeployConfirmed();
        }
    }

    validate(projectTitle) {
        return projectTitle === "hola";
    }

    render() {
        const { projectTitle } = this.state;
        const isEnabled = this.validate(projectTitle);
        return(
            <div class={classNames([style.mainnetWarning, "modal"])}>
                <div class={style.container}>
                    <ModalHeader
                        title="Warning - Deploying to Mainnet"
                        onCloseClick={this.onCloseClickHandle}
                    />
                    <div class={style.area}>
                        <div>
                            This action <b>cannot</b> be undone. This will deploy your contract from the <b>HelloWorld</b> project all the way to Mainnet.
                        </div>
                        <div class={style.form}>
                            <div class={style.info}>
                                <div class="superInputDark my-2">
                                    <label for="html">Type the name of the project to confirm: </label>
                                    <input
                                        id="projectName"
                                        type="text"
                                        value={projectTitle}
                                        onKeyUp={this.handleTitleChange}
                                        autoComplete={"off"}/>
                                </div>
                            </div>
                        </div>
                        <button disabled={!isEnabled} class={style.buttonConfirm} onClick={this.onCreateProjectHandle}>I understand, start deploying to Mainnet</button>
                    </div>
                </div>
            </div>
        );
    }
}

MainnetWarning.proptypes = {
    categories: Proptypes.array.isRequired,
    templates: Proptypes.array.isRequired,
    onTemplateSelected: Proptypes.func.isRequired,
    onCloseClick: Proptypes.func.isRequired
}
