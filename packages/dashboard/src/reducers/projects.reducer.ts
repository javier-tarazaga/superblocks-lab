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

import { projectsActions } from '../actions/projects.actions';
import { IProjectState } from '../models/state';
import { AnyAction } from 'redux';

export const initialState: IProjectState = {
    project: undefined,
};

export default function projectsReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case projectsActions.LOAD_PROJECT_SUCCESS: {
            return {
                ...state,
                project: { ...action.data.project, files: undefined },
            };
        }
        case projectsActions.RENAME_PROJECT_FAIL: {
            console.log('rename project failed: ', action.data);

            return {
                ...state,
            };
        }
        case projectsActions.LOAD_PROJECT_FAIL: {
            console.log('project load failed', action.data);

            return {
                ...state,
            };
        }
        case projectsActions.DELETE_PROJECT_SUCCESS: {
            return {
                ...state,
                project: null
            };
        }
        case projectsActions.UPDATE_PROJECT_SUCCESS: {
            return {
                ...state,
                project: { ...action.data.project, files: undefined }
            };
        }
        default:
            return state;
    }
}