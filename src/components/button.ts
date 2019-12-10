class Button {
  private text: string;

  constructor(protected button: HTMLButtonElement) {
    this.text = button.innerHTML;
  }

  public enable = () => {
    this.button.innerHTML = this.text;
    this.button.disabled = false;
  };

  public disable = (text?: string) => {
    this.button.innerHTML = text || 'Verifying...';
    this.button.disabled = true;
  };

  public bind = (onClick: OnClick) => {
    this.button.addEventListener('click', onClick);
  };

  public unbind = (onClick: OnClick) => {
    this.button.removeEventListener('click', onClick);
  };
}

type OnClick = (e: MouseEvent) => void | Promise<void>;

export default Button;
