import { CallbackType, ChoiceCallback } from '@forgerock/javascript-sdk';
import FRStepHandlerBase from '../../fr-step-handler-base';
import { replaceTokens } from '../../util/template';
import { ExpressStage } from '../enums';
import deviceRegistrationTemplate from '../views/device-registration-choice.html';
import passwordlessTemplate from '../views/passwordless-choice.html';
import secondFactorTemplate from '../views/second-factor-choice.html';

/** @hidden */
const ATTR_NAME = 'data-choice';

/** @hidden */
interface IconText {
  icon: string;
  text: string;
}

/**
 * Handler that renders the three different uses of a choice collector in Express:
 * - Prompt to register a security device
 * - Prompt to "go passwordless"
 * - Prompt to select method to receive second factor
 */
class ChoiceStepHandler extends FRStepHandlerBase {
  /** @hidden */
  public retry = undefined;

  protected bind = () => {
    this.target.addEventListener('click', this.onClick);
  };

  protected unbind = () => {
    this.target.removeEventListener('click', this.onClick);
  };

  protected getTemplate = () => {
    switch (this.step.getStage()) {
      case ExpressStage.DeviceRegistrationChoice:
        return deviceRegistrationTemplate;
      case ExpressStage.PasswordlessChoice:
        return passwordlessTemplate;
      case ExpressStage.SecondFactorChoice:
        return this.renderSecondFactorChoiceTemplate(secondFactorTemplate);
    }
    throw new Error(`Unsupported choice type "${this.step.getStage()}"`);
  };

  private onClick = (e: MouseEvent) => {
    const attributeValue = (e.srcElement as HTMLElement).getAttribute(ATTR_NAME);
    if (attributeValue === null) {
      return;
    }

    const choiceIndex = Number(attributeValue);
    const callback = this.getCallback();
    callback.setChoiceIndex(choiceIndex);
    this.unbind();
    this.deferred.resolve(this.step);
  };

  private renderSecondFactorChoiceTemplate = (template: string) => {
    const callback = this.getCallback();
    const choices = callback.getChoices();
    const model = this.updateChoiceStrings(choices);
    const choicesMarkup = this.getChoicesMarkup(model);
    const subtitleMarkup = this.getSubtitleMarkup(model.length);
    const dataTemplate = replaceTokens(template, {
      CHOICES: choicesMarkup,
      SUBTITLE: subtitleMarkup,
    });
    return dataTemplate;
  };

  private getSubtitleMarkup(numChoices: number) {
    return numChoices === 3
      ? "<p>You'll need to verify it's you to continue signing in to your account.</p>"
      : "<p>You'll need a verification code to continue signing in to your account.</p>";
  }

  private getChoicesMarkup(choices: IconText[]) {
    return `<ul class="fr-list">
    ${choices
      .map(
        (choice: any, i: number) =>
          `<li class="fr-list-item fr-icon-list-${choice.icon}" data-choice="${i}">${choice.text}</li>`,
      )
      .join('')}</ul>`;
  }

  private updateChoiceStrings(choices: string[]) {
    const twoChoices = choices.length === 2 ? true : false;
    return choices.map((choice) => {
      const icon = choice.toLowerCase();
      switch (choice) {
        case 'Device':
          return { icon, text: 'Use your device' };
        case 'Email':
          return { icon, text: `${twoChoices ? 'Receive an email' : 'Email a code'}` };
        case 'SMS':
          return { icon, text: `${twoChoices ? 'Receive a text' : 'Text a code'}` };
        default:
          throw new Error(`Unsupported choice "${choice}"`);
      }
    });
  }

  private getCallback = () => {
    return this.step.getCallbackOfType<ChoiceCallback>(CallbackType.ChoiceCallback);
  };
}

export default ChoiceStepHandler;
