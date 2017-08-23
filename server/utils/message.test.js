var expect = require('expect');

var {generateMessage} = require('./message');

describe('', () => {
  it('should generate correct message object', () => {
    var from = 'test';
    var text = 'test message';
    var message = generateMessage(from, text);

    expect(message).toInclude({from, text});
    expect(message.createdAt).toBeA('number');

  });
});
