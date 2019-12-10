class PasswordInput {
  private group: HTMLElement;
  private toggler: HTMLElement;
  private togglerIcon: HTMLElement;

  constructor(protected input: HTMLInputElement) {
    this.group = input.closest('.form-group') as HTMLElement;
    this.toggler = this.group.querySelector('button') as HTMLElement;
    this.togglerIcon = this.toggler.querySelector('i') as HTMLElement;
  }

  public bind = () => {
    this.toggler.addEventListener('click', this.onToggle);
  };

  public unbind = () => {
    this.toggler.removeEventListener('click', this.onToggle);
  };

  private onToggle = () => {
    this.input.type = this.input.type === 'text' ? 'password' : 'text';
    this.togglerIcon.innerText = this.input.type === 'text' ? 'visibility' : 'visibility_off';
  };
}

export default PasswordInput;
