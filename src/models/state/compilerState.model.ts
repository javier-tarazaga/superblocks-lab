// Copyright 2019 Superblocks AB
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

import { IProjectItem } from '../project';

export interface IConsoleRow {
    channel: number;
    msg: string;
}

export interface ICompilerState {
    input: any;
    files: any;
    consoleRows: IConsoleRow[];
    targetContractPath: string[];
    targetContractHash: string;

    outputFolderPath: string[];
    outputFiles: IProjectItem[];
}
