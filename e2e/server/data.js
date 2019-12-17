// An authId value is required, but the value is opaque
const authId = 'foo';

const data = {
  BooleanAttributeCallbackRendererTest: {
    authId,
    callbacks: [
      {
        type: 'BooleanAttributeInputCallback',
        output: [{ name: 'prompt', value: 'I like ponies' }],
        input: [{ name: 'IDToken1', value: '' }],
        _id: 0,
      },
    ],
  },
  ChoiceCallbackRendererTest: {
    authId,
    callbacks: [
      {
        type: 'ChoiceCallback',
        output: [
          { name: 'prompt', value: 'How much do you like ponies?' },
          { name: 'choices', value: ['Not at all', 'A little', 'A lot!'] },
          { name: 'defaultChoice', value: 1 },
        ],
        input: [{ name: 'IDToken1', value: 1 }],
      },
    ],
  },
};

module.exports = data;
