import Button from "@skbkontur/react-ui/Button";
import Gapped from "@skbkontur/react-ui/Gapped";
import * as React from "react";
import { FieldInfo } from "../../api/impl/FieldInfo";
import AccessConfiguration from "../utils/AccessConfiguration";
import { DeleteModal } from "./DeleteModal";
import ObjectDetails from "./ObjectDetails";
import * as styles from "./ObjectDetailsView.less";

interface IProps {
  data: object;
  typeInfo: FieldInfo;
  onSave: (o: object) => Promise<void>;
  onDelete: () => Promise<void>;
}

interface IState {
  edit: boolean;
  currentValue: object;
  saving: boolean;
  deleting: boolean;
}

export default class ObjectDetailsContent extends React.Component<
  IProps,
  IState
> {
  private deleteModal: DeleteModal;

  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      currentValue: null,
      deleting: false,
      saving: false,
    };
  }

  public render() {
    return (
      <Gapped vertical>
        <div className={styles.detailsWrapper}>
          <ObjectDetails
            data={this.state.edit ? this.state.currentValue : this.props.data}
            edit={this.state.edit}
            typeInfo={this.props.typeInfo}
            onChange={this.handleChange}
          />
        </div>
        {this.renderEditButtons()}
      </Gapped>
    );
  }

  private renderEditButtons() {
    if (!AccessConfiguration.isEditAllowed()) {
      return null;
    }
    return (
      <div>
        <DeleteModal ref={this.refToDeleteModal} />
        {this.state.edit ? (
          <Gapped>
            <Button
              use="primary"
              onClick={this.handleSave}
              loading={this.state.saving}
              disabled={this.state.deleting}
            >
              Сохранить
            </Button>
            <Button onClick={this.handleCancelEdit}>Отменить</Button>
          </Gapped>
        ) : (
          <Gapped>
            <Button onClick={this.handleEdit}>Редактировать</Button>
            <Button
              use="danger"
              onClick={this.handleDelete}
              loading={this.state.deleting}
              disabled={this.state.saving}
            >
              Удалить
            </Button>
          </Gapped>
        )}
      </div>
    );
  }

  private handleChange = newValue => this.setState({ currentValue: newValue });
  private refToDeleteModal = c => (this.deleteModal = c);
  private handleSave = async () => {
    try {
      this.setState({ saving: true });
      await this.props.onSave(this.state.currentValue);
      this.setState({ saving: false, edit: false });
    } catch (e) {
      this.setState({ saving: false });
      console.error(e);
    }
  };
  private handleCancelEdit = () => this.setState({ edit: false });
  private handleEdit = () =>
    this.setState({ edit: true, currentValue: this.props.data });
  private handleDelete = async () => {
    try {
      this.setState({ deleting: true });
      if (await this.deleteModal.show()) {
        await this.props.onDelete();
      }
      this.setState({ deleting: false });
    } catch (e) {
      this.setState({ deleting: false });
      console.error(e);
    }
  };
}
