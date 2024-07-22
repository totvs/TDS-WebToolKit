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


/**
 * Defines the props for the TDS Paginator component.
 * @param currentPage - The current page number.
 * @param currentItem - The current item number.
 * @param totalItems - The total number of items.
 * @param pageSize - The number of items to display per page.
 * @param onPageChange - A callback function that is called when the page is changed, with the selected page number as a parameter.
 */
export type TTdsPaginatorProps = {
	currentPage: number;
	firstPageItem: number;
	totalItems: number;
	pageSize: number;
	onPageChange(selectedPage: number): void;
}
