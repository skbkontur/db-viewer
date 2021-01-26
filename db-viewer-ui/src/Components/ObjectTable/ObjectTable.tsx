import SortDefaultIcon from "@skbkontur/react-icons/SortDefault";
import SortDownIcon from "@skbkontur/react-icons/SortDown";
import SortUpIcon from "@skbkontur/react-icons/SortUp";
import { Link } from "@skbkontur/react-ui";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { PropertyMetaInformation } from "../../Domain/Api/DataTypes/PropertyMetaInformation";
import { Sort } from "../../Domain/Api/DataTypes/Sort";
import { ICustomRenderer } from "../../Domain/Objects/CustomRenderer";
import { AdvancedTable } from "../AdvancedTable/AdvancedTable";
import { ConfirmDeleteObjectModal } from "../ConfirmDeleteObjectModal/ConfirmDeleteObjectModal";
import { ScrollableContainer } from "../Layouts/ScrollableContainer";
import { renderForTableCell } from "../ObjectViewer/ObjectItemRender";

import styles from "./ObjectTable.less";

interface ObjectTableProps {
    customRenderer: ICustomRenderer;
    items: object[];
    objectType: string;
    properties: PropertyMetaInformation[];
    onChangeSortClick: (name: string) => void;
    onDetailsClick: (item: object) => string;
    onDeleteClick: (index: number) => Promise<void>;
    currentSorts: Sort[];
    allowDelete: boolean;
    allowSort: boolean;
}

interface ObjectTableState {
    showConfirmModal: boolean;
    deletedIndex: number | null;
}

export class ObjectTable extends React.Component<ObjectTableProps, ObjectTableState> {
    public state: ObjectTableState = {
        showConfirmModal: false,
        deletedIndex: null,
    };

    public componentDidUpdate(prevProps: ObjectTableProps): void {
        if (prevProps.items !== this.props.items) {
            window.scrollTo(0, 0);
        }
    }

    public render(): JSX.Element {
        const { items, properties, allowDelete, allowSort } = this.props;

        return (
            <ScrollableContainer className={styles.tableWrapper}>
                {this.state.showConfirmModal && (
                    <ConfirmDeleteObjectModal onDelete={this.handleDeleteItem} onCancel={this.handleCancelDelete} />
                )}
                {properties.length !== 0 && items.length !== 0 ? (
                    <AdvancedTable>
                        <AdvancedTable.Head data-tid="TableHeader" className={styles.tableHeader}>
                            <AdvancedTable.Row className={styles.row}>
                                {this.renderEmpty(allowDelete ? 2 : 1)}
                                {properties.map((item, key) => this.renderTableHeader(item, key, allowSort))}
                            </AdvancedTable.Row>
                        </AdvancedTable.Head>
                        <AdvancedTable.Body data-tid="Body">
                            {items.map((item, index) => (
                                <AdvancedTable.Row key={index} className={styles.row} data-tid="Row">
                                    {this.renderControls(item, index)}
                                    {properties.map(key => this.renderCell(item, key.name, key))}
                                </AdvancedTable.Row>
                            ))}
                        </AdvancedTable.Body>
                    </AdvancedTable>
                ) : (
                    <div data-tid="NothingFound">Ничего не найдено</div>
                )}
            </ScrollableContainer>
        );
    }

    private readonly handleDeleteItem = () => {
        if (this.state.deletedIndex != null) {
            this.props.onDeleteClick(this.state.deletedIndex);
        }
        this.handleCancelDelete();
    };

    private readonly handleCancelDelete = () => {
        this.setState({
            showConfirmModal: false,
            deletedIndex: null,
        });
    };

    private readonly handleConfirmDeletion = (index: number) => {
        this.setState({
            showConfirmModal: true,
            deletedIndex: index,
        });
    };

    public renderEmpty(count: number): JSX.Element[] {
        const arr: JSX.Element[] = [];
        for (let i = 0; i < count; i++) {
            arr.push(
                <AdvancedTable.HeadCell key={i} className={styles.cell}>
                    &nbsp;
                </AdvancedTable.HeadCell>
            );
        }
        return arr;
    }

    public getIcon(name: string, currentSort: Sort[]): JSX.Element {
        const dictionary: { [key: string]: JSX.Element } = {
            Ascending: <SortUpIcon />,
            Descending: <SortDownIcon />,
        };
        const currentSortOrder = currentSort.find(x => x.path === name)?.sortOrder;
        if (currentSortOrder) {
            return dictionary[currentSortOrder];
        }

        return <SortDefaultIcon />;
    }

    public renderTableHeader(item: PropertyMetaInformation, key: number, allowSort: boolean): JSX.Element {
        const name = item.name;
        const content =
            item.isSortable && allowSort ? (
                <Link
                    data-tid={`Header_${name}`}
                    icon={this.getIcon(name, this.props.currentSorts)}
                    onClick={() => this.props.onChangeSortClick(name)}>
                    {name}
                </Link>
            ) : (
                name
            );

        return (
            <AdvancedTable.HeadCell className={`${styles.cell} ${styles.headerCell}`} key={key}>
                {content}
            </AdvancedTable.HeadCell>
        );
    }

    public renderControls(item: object, index: number): JSX.Element[] {
        const arr: JSX.Element[] = [];
        let key = 0;
        let pathToItem = "";
        if (item) {
            pathToItem = this.props.onDetailsClick(item);
        }
        arr.push(
            <td key={++key} className={styles.cell}>
                <RouterLink className={styles.routerLink} to={pathToItem} data-tid="Details">
                    Подробности
                </RouterLink>
            </td>
        );
        if (this.props.allowDelete) {
            arr.push(
                <td key={++key} className={styles.cell}>
                    <Link onClick={() => this.handleConfirmDeletion(index)} use="danger" data-tid="Delete">
                        Удалить
                    </Link>
                </td>
            );
        }
        return arr;
    }

    public renderCell(item: any, key: string, type: PropertyMetaInformation): JSX.Element {
        const { customRenderer, objectType } = this.props;
        return (
            <td key={key} className={styles.cell} data-tid={key}>
                {renderForTableCell(item, [key], type, objectType, customRenderer)}
            </td>
        );
    }
}
