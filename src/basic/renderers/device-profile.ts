import { DeviceProfileCallback, FRDevice } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';

/**
 * Renders no visible elements.  Automatically triggers a "change" event after the
 * profile's been collected.
 */
class DeviceProfileCallbackRenderer implements CallbackRenderer {
  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(
    private callback: DeviceProfileCallback,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  /**
   * Creates all required DOM elements and returns the containing element.
   */
  public render = (): HTMLDivElement => {
    return el<HTMLDivElement>('span');
  };

  /**
   * Collects the device profile, and calls `onChange` when complete.
   */
  public onInjected = (): void => {
    const isLocationRequired = this.callback.isLocationRequired();
    const isMetadataRequired = this.callback.isMetadataRequired();

    const device = new FRDevice();
    device
      .getProfile({
        location: isLocationRequired,
        metadata: isMetadataRequired,
      })
      .then((profile) => {
        this.callback.setProfile(profile);
        this.onChange(this);
      });
  };
}

export default DeviceProfileCallbackRenderer;
