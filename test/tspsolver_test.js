'use strict';

var tspsolver = require('../lib/tspsolver.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['tspsolver'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(4);
    // tests here

    tspsolver.addAddress("100 WILSHIRE BLVD, SANTA MONICA, CA");
    tspsolver.addAddress("1 WILSHIRE BLVD, SANTA MONICA, CA");
    tspsolver.addAddress("7000 Hollywood Blvd, Los Angeles, CA");

    tspsolver.solveRoundTrip(function() {
        var addresses = tspsolver.getAddresses();

        console.log(addresses);
        test.equal(addresses[0], '100 WILSHIRE BLVD, SANTA MONICA, CA', 'should be 100 WILSHIRE BLVD, SANTA MONICA, CA');
        test.equal(addresses[1], '1 WILSHIRE BLVD, SANTA MONICA, CA', 'should be 1 WILSHIRE BLVD, SANTA MONICA, CA');
        test.equal(addresses[2], '7000 Hollywood Blvd, Los Angeles, CA', 'should be 7000 Hollywood Blvd, Los Angeles, CA');

        var link = tspsolver.createGoogleLink();
        var expected_link = "http://maps.google.com/maps?saddr=100%20WILSHIRE%20BLVD%2C%20SANTA%20MONICA%2C%20CA&daddr=7000%20Hollywood%20Blvd%2C%20Los%20Angeles%2C%20CA to:1%20WILSHIRE%20BLVD%2C%20SANTA%20MONICA%2C%20CA to:100%20WILSHIRE%20BLVD%2C%20SANTA%20MONICA%2C%20CA";

        test.equal(link,expected_link, "should be "+expected_link);

        test.done();
    });
  }
};
