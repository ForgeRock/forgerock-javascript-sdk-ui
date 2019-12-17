const { CallbackType } = require('@forgerock/javascript-sdk');

// An authId value is required, but the value is opaque
const authId = 'foo';

const data = {
  BooleanAttributeCallbackRendererTest: {
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
  ChoiceCallbackRendererTest: {
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
};

module.exports = data;
