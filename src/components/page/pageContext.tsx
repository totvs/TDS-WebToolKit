import React from 'react';
import { createContext } from 'react';
import { IPageState } from '../../utilities/vscodeWrapper';

export interface TStatePage extends IPageState {
    //
};

// export type TStatePageAction = {
//     type: "set_form_orientation", value: FormGroupVariant;
// }

// export function pageReducer(actualState: TStatePage, action: TStatePageAction) {
//     switch (action.type) {
//         case 'set_form_orientation': {
//             return { ...actualState, value: action.value };
//         }
//         default: {
//             throw Error('Unknown action: ' + action.type);
//         }
//     }
// }

export const PageContext: React.Context<TStatePage> = createContext<TStatePage>(undefined);


