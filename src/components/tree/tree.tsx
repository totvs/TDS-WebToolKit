import {
	provideFASTDesignSystem,
	fastTreeItem,
	fastTreeView
} from "@microsoft/fast-components";
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import React from 'react';

import "./tree.css";

const { wrap } = provideReactWrapper(
	React,
	provideFASTDesignSystem()
);

export const TdsTreeView = wrap(fastTreeView());
export const TdsTreeItem = wrap(fastTreeItem());

