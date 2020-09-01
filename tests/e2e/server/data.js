/*
 * @forgerock/javascript-sdk-ui
 *
 * data.js
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

const { CallbackType } = require('@forgerock/javascript-sdk');

// An authId value is required, but the value is opaque
const authId = 'foo';

const data = {
  BooleanAttributeCallbackRenderer: {
    authId,
    callbacks: [
      {
        _id: 0,
        input: [{ name: 'IDToken1', value: false }],
        output: [
          { name: 'name', value: 'test' },
          { name: 'prompt', value: 'I like ponies!' },
          { name: 'required', value: true },
          { name: 'policies', value: [] },
          { name: 'failedPolicies', value: [] },
          { name: 'value', value: false },
        ],
        type: CallbackType.BooleanAttributeInputCallback,
      },
    ],
  },
  ChoiceCallbackRenderer: {
    authId,
    callbacks: [
      {
        _id: 0,
        input: [{ name: 'IDToken1', value: 1 }],
        output: [
          { name: 'prompt', value: 'How much do you like ponies?' },
          { name: 'choices', value: ['Not at all', 'A little', 'A lot!'] },
          { name: 'defaultChoice', value: 1 },
        ],
        type: CallbackType.ChoiceCallback,
      },
    ],
  },
  ConfirmationCallbackRenderer: {
    authId,
    callbacks: [
      {
        _id: 0,
        input: [{ name: 'IDToken1', value: 0 }],
        output: [
          { name: 'prompt', value: '' },
          { name: 'messageType', value: 0 },
          { name: 'options', value: ['Yes', 'No'] },
          { name: 'optionType', value: -1 },
          { name: 'defaultOption', value: 1 },
        ],
        type: CallbackType.ConfirmationCallback,
      },
    ],
  },
  KbaCreateCallbackRenderer: {
    authId,
    callbacks: [
      {
        _id: 0,
        input: [
          { name: 'IDToken1question', value: '' },
          { name: 'IDToken1answer', value: '' },
        ],
        output: [
          { name: 'prompt', value: 'Foo!' },
          {
            name: 'predefinedQuestions',
            value: ["What's your favorite color?", 'Who was your first employer?'],
          },
        ],
        type: CallbackType.KbaCreateCallback,
      },
      {
        _id: 1,
        input: [
          { name: 'IDToken2question', value: '' },
          { name: 'IDToken2answer', value: '' },
        ],
        output: [
          { name: 'prompt', value: 'Foo!' },
          {
            name: 'predefinedQuestions',
            value: ["What's your favorite color?", 'Who was your first employer?'],
          },
        ],
        type: CallbackType.KbaCreateCallback,
      },
    ],
  },
  PasswordCallbackRenderer: {
    authId,
    callbacks: [
      {
        _id: 0,
        input: [{ name: 'IDToken1', value: '' }],
        output: [
          { name: 'echoOn', value: false },
          { name: 'policies', value: [] },
          { name: 'failedPolicies', value: [] },
          { name: 'prompt', value: 'Password' },
        ],
        type: CallbackType.ValidatedCreatePasswordCallback,
      },
    ],
  },
  TermsAndConditionsCallbackRenderer: {
    authId,
    callbacks: [
      {
        _id: 0,
        input: [{ name: 'IDToken1', value: false }],
        output: [
          { name: 'version', value: '0.0' },
          { name: 'terms', value: 'Lorem ipsum dolor sit amet' },
          { name: 'createDate', value: '2019-10-28T04:20:11.320Z' },
        ],
        type: CallbackType.TermsAndConditionsCallback,
      },
    ],
  },
  TextOutputCallbackRenderer: {
    authId,
    callbacks: [
      {
        _id: 0,
        output: [
          { name: 'message', value: 'Ponies are your friends' },
          { name: 'messageType', value: '0' },
        ],
        type: CallbackType.TextOutputCallback,
      },
    ],
  },
};

module.exports = data;
