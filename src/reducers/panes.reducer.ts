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

import { panesActions } from '../actions';
import { replaceInArray } from './utils';
import { AnyAction } from 'redux';
import { IPanesState } from '../models/state';

export const initialState: IPanesState = {
    items: []
};

export default function panesReducer(state = initialState, action: AnyAction) {
    switch (action.type) {

        case panesActions.OPEN_FILE: {
            const items = replaceInArray(state.items.slice(), p => p.active, p => ({ ...p, active: false }));
            const itemIndex = items.findIndex(i => i.file.id === action.data.id);
            if (itemIndex >= 0) {
                items[itemIndex] = { ...items[itemIndex], active: true };
            } else {
                items.unshift({ file: action.data, active: true, hasUnsavedChanges: false });
            }
            return {
                ...state,
                items
            };
        }

        case panesActions.CLOSE_PANE: {
            const removeItemIndex = state.items.findIndex(i => i.file.id === action.data.id);

            if (removeItemIndex < 0) {
                return state;
            }

            // remove pane
            const items = state.items.slice();
            const removedPane = items.splice(removeItemIndex, 1)[0];

            if (removedPane.active) {
                // activate next item or the last one
                const activeItemIndex = Math.min(items.length - 1, removeItemIndex);
                if (activeItemIndex >= 0) {
                    items[activeItemIndex] = { ...items[activeItemIndex], active: true };
                }
            }

            return {
                ...state,
                items
            };
        }

        case panesActions.CLOSE_ALL_OTHER_PANES: {
            const item = state.items.find(i => i.file.id === action.data.id);
            if (!item) {
                return state;
            }

            return {
                ...state,
                items: [ item ]
            };
        }

        case panesActions.CLOSE_ALL_PANES: {
            return initialState;
        }

        case panesActions.SAVE_FILE_SUCCESS: {
            return {
                ...state,
                items: replaceInArray(
                    state.items,
                    p => p.file.id === action.data.fileId,
                    p => ({ ...p, hasUnsavedChanges: false, file: { ...p.file, code: action.data.code } })
                )
            };
        }

        case panesActions.SET_UNSAVED_CHANGES:
            return {
                ...state,
                items: replaceInArray(
                    state.items,
                    p => p.file.id === action.data.fileId,
                    p => ({ ...p, hasUnsavedChanges: action.data.hasUnsavedChanges })
                )
            };

        default:
            return state;
    }
}
