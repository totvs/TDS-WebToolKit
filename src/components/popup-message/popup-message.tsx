/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
Copyright 2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { TdsFieldProps } from "../form/form";
import "./popup-message.css";
import { ControllerFieldState } from "react-hook-form";

export interface IPopupMessage {
	field: TdsFieldProps,
	fieldState: ControllerFieldState
}

function buildMessage(props: IPopupMessage): string {
	const { label, info } = props.field;
	const { error } = props.fieldState;
	let message: string = info || "";

	if (error) {
		if (error.type == "required") {
			message = error.message || `[${label}] is required.`;
		} else if (error.type == "min") {
			message = error.message || `[${label}] is not valid range (min value).`;
		} else if (error.type == "max") {
			message = error.message || `[${label}] is not valid range (max value).`;
		} else {
			message = error.message || error.message || `${error.type}<Unknown>`
		}
	}

	return message;
}

/**
 * Renders a popup message for a form field based on its state.
 * 
 * @param props - The props containing the field and its state.
 * 
 * @returns A JSX element containing the popup message if needed.
 */
export default function PopupMessage(props: IPopupMessage): JSX.Element {
	const OFFSET_LEFT: number = 20;
	const OFFSET_TOP: number = 2;
	const type: string = props.fieldState.invalid ? "error" : "info";

	const message: string = buildMessage(props);

	const preparePopup: any = (/*event: any*/): HTMLSpanElement => {
		const popup = document.getElementById("popup_" + props.field.name) as HTMLElement;
		const parent = popup.parentElement!.parentElement as HTMLElement;

		if (parent) {
			popup.style.width = `${parent.clientWidth - OFFSET_LEFT}px`;
			popup.style.left = `${OFFSET_LEFT - parent.clientWidth}px`;
			popup.style.top = `${parent.offsetHeight - OFFSET_TOP}px`;
		}

		return popup;
	};

	const mouseOver: any = (event: any) => {
		const popup = preparePopup(event);

		popup.classList.toggle("show");
	};

	const mouseOut: any = (/*event: any*/) => {
		const popup = document.getElementById("popup_" + props.field.name) as HTMLElement;
		popup.classList.toggle("show");
	};

	return (
		(message.length > 0) ?
			<span slot="end" className={`tds-popup codicon codicon-${type} tds-${type}`}
				onMouseOver={(event) => mouseOver(event)}
				onMouseOut={(event) => mouseOut(event)}
			>
				<span className={`tds-popup-text tds-${type}`} id={"popup_" + props.field.name}>{message}</span>
			</span>
			: <></>
	);
}
