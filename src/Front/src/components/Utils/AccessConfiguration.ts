class AccessConfiguration {
  private allowEdit: boolean;
  public initialize(allowEdit: boolean) {
    this.allowEdit = allowEdit;
  }

  public isEditAllowed() {
    return this.allowEdit;
  }
}
export default new AccessConfiguration();
