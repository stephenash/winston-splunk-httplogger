/* eslint-env node, mocha */

var SplunkStreamEvent = require('..');
var assert = require('assert');

describe('createLogger', function () {
  it('should error without config', function () {
    try {
      var s = new SplunkStreamEvent(); // eslint-disable-line no-unused-vars
      assert.ok(false, 'Expected an error');
    } catch (err) {
      assert.ok(err);
    }
  });

  it('should error without a splunk object', function () {
    try {
      var s = new SplunkStreamEvent({}); // eslint-disable-line no-unused-vars
      assert.ok(false, 'Expected an error');
    } catch (err) {
      assert.ok(err);
    }
  });

  it('should error without a splunk token', function () {
    try {
      var s = new SplunkStreamEvent({ splunk: {} }); // eslint-disable-line no-unused-vars
      assert.ok(false, 'Expected an error');
    } catch (err) {
      assert.ok(err);
    }
  });

  it('should create a suitable logger with minimal config', function () {
    var s = new SplunkStreamEvent({ splunk: { token: 'foo' } });
    assert.ok(s instanceof SplunkStreamEvent);
  });

  it('should provide a default level of info', function () {
    var s = new SplunkStreamEvent({ splunk: { token: 'foo' } });
    assert.strictEqual('info', s.level);
  });

  it('should set the name property', function () {
    var s = new SplunkStreamEvent({ splunk: { token: 'foo' } });
    assert.strictEqual('SplunkStreamEvent', s.name);
  });

  it('should store the token in the splunk config', function () {
    var s = new SplunkStreamEvent({ splunk: { token: 'foo' } });
    assert.strictEqual('foo', s.config().token);
  });

  it('should provide a default host', function () {
    var s = new SplunkStreamEvent({ splunk: { token: 'foo' } });
    assert.strictEqual('localhost', s.config().host);
  });

  it('should allow an override for the default host', function () {
    var s = new SplunkStreamEvent({ splunk: { host: 'bar', token: 'foo' } });
    assert.strictEqual('bar', s.config().host);
  });

  it('should provide a default port', function () {
    var s = new SplunkStreamEvent({ splunk: { token: 'foo' } });
    assert.strictEqual(8088, s.config().port);
  });

  it('should allow an override for the default host', function () {
    var s = new SplunkStreamEvent({ splunk: { port: 2000, token: 'foo' } });
    assert.strictEqual(2000, s.config().port);
  });

  it('should set the maxBatchCount by default', function () {
    var s = new SplunkStreamEvent({ splunk: { token: 'foo' } });
    assert.strictEqual(1, s.config().maxBatchCount);
  });

  it('should allow an override for the default eventFormatter', function () {
    var s = new SplunkStreamEvent({ splunk: { eventFormatter: 'foo', token: 'foo' } });
    assert.strictEqual('foo', s.server.eventFormatter);
  });

  describe('payloadMetadata fields', function () {
    it('should have default values', function () {
      var s = new SplunkStreamEvent({ splunk: { token: 'foo' } });

      var expected = { source: 'winston', sourcetype: 'winston-splunk-logger' };
      assert.deepStrictEqual(expected, s.payloadMetadata);
    });

    it('should not have default values for sourcetype when it is not defined', function () {
      var s = new SplunkStreamEvent({ splunk: {
        token: 'foo',
        payloadMetadata: {
          source: 'custom-source'
        }
      } });

      var expected = { source: 'custom-source', sourcetype: 'winston-splunk-logger' };
      assert.deepStrictEqual(expected, s.payloadMetadata);
    });

    it('should support the host, index, and time attributes', function () {
      var s = new SplunkStreamEvent({ splunk: {
        token: 'foo',
        payloadMetadata: {
          host: 'custom-host',
          index: 'custom-index',
          time: 1234567890
        }
      } });

      var expected = {
        host: 'custom-host',
        index: 'custom-index',
        source: 'winston',
        sourcetype: 'winston-splunk-logger',
        time: 1234567890
      };
      assert.deepStrictEqual(expected, s.payloadMetadata);
    });

    it('shouldn\'t support custom attributes', function () {
      var s = new SplunkStreamEvent({ splunk: {
        token: 'foo',
        payloadMetadata: {
          foo: 1
        }
      } });
      assert.equal(null, s.payloadMetadata.foo);
    });
  });
});
