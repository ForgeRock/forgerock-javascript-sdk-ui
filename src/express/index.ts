import { FRStep } from '@forgerock/javascript-sdk';
import { FRUIStepHandlerFactory } from '../interfaces';
import { ExpressStage } from './enums';
import ChoiceStepHandler from './handlers/choice';
import DeviceAuthenticationStepHandler from './handlers/device-authentication';
import DeviceRegistrationStepHandler from './handlers/device-registration';
import PasswordStepHandler from './handlers/password';
import RegistrationUserInfoStepHandler from './handlers/registration-user-info';
import UsernameStepHandler from './handlers/username';
import UsernamePasswordStepHandler from './handlers/username-password';

/**
 * A factory for creating a step handler for the provided Express step.
 *
 * @param target The DOM element in which to render the step
 * @param step The step to render
 */
const expressStepHandlerFactory: FRUIStepHandlerFactory = (target: HTMLElement, step: FRStep) => {
  if (!step) {
    throw new Error('Cannot create handler; no step specified');
  }

  const stage = step.getStage();

  switch (stage) {
    case ExpressStage.DeviceRegistrationChoice:
    case ExpressStage.PasswordlessChoice:
    case ExpressStage.SecondFactorChoice:
      return new ChoiceStepHandler(target, step);
    case ExpressStage.OneTimePasswordEmail:
    case ExpressStage.OneTimePasswordSMS:
    case ExpressStage.UserPassword:
      return new PasswordStepHandler(target, step);
    case ExpressStage.Username:
      return new UsernameStepHandler(target, step);
    case ExpressStage.UsernamePassword:
      return new UsernamePasswordStepHandler(target, step);
    case ExpressStage.DeviceAuthentication:
      return new DeviceAuthenticationStepHandler(target, step);
    case ExpressStage.DeviceRegistration:
      return new DeviceRegistrationStepHandler(target, step);
    case ExpressStage.RegistrationUserInfo:
      return new RegistrationUserInfoStepHandler(target, step);
    default:
      throw new Error(`Unsupported stage "${stage}"`);
  }
};

export default expressStepHandlerFactory;
