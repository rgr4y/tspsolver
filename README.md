tspsolver
=========

Server-side node module adaptation of google-maps-tsp-solver (https://code.google.com/p/google-maps-tsp-solver/). Uses googlemaps node module.

More information on how the original was implemented:

https://code.google.com/p/google-maps-tsp-solver/

## Example 1 - Round Trip using Express framework

<pre><code>
var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send(&quot;Use /route-optimizer&quot;)
})

app.all('/route-optimizer', function(req, res) {
    var tsp = require('tspsolver');

    if (req.method == &quot;POST&quot;) {
        var addresses = req.body.address;
    } else if (typeof req.query.address !== &quot;undefined&quot;) {
        var addresses = req.query.address;
    } else {
        res.send(&quot;No addresses specified!&quot;);
    }

    if (typeof addresses == &quot;string&quot;) {
        var addressSingle = addresses;
        addresses = new Array();
        addresses.push(addressSingle);
    }

    for (var i=0;i&lt;addresses.length;i++) {
        console.log(&quot;Adding address '&quot;+addresses[i]+&quot;'&quot;);
        tsp.addAddress(addresses[i]);
    }

    tsp.solveRoundTrip(function() {
        var embed_uri = tsp.createGoogleLink(true);
        var map_uri   = tsp.createGoogleLink();

        var send = {
            'addresses': addresses,
            'embed_uri': embed_uri,
            'map_uri' :  map_uri
        };

        console.log(send);
        res.send(send);
    })
})

app.listen(3000);

</code></pre>

## Example 2 - Address verification using Express
<pre><code>
var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send(&quot;Use /address-checker&quot;)
})

app.all('/address-checker', function(req, res) {
    var gm = require(&quot;googlemaps&quot;);

    if (req.method == &quot;POST&quot;) {
        var addresses = req.body.address;
    } else if (typeof req.query.address !== &quot;undefined&quot;) {
        var addresses = req.query.address;
    } else {
        res.send(&quot;No addresses specified!&quot;);
    }

    if (typeof addresses == &quot;string&quot;) {
        var addressSingle = addresses;
        addresses = new Array();
        addresses.push(addressSingle);
    }

    // console.log(addresses);

    var addressResult = new Array();

    var processing = true;

    var geoCode = function(address)
    {
        gm.geocode(address, function(err, data) {
            var formatted_address = 'INVALID ADDRESS', valid = false, partial_match = false;

            try {
                formatted_address = data.results[0].formatted_address;
                valid = data.results[0].formatted_address ? true : false;
                partial_match = data.results[0].partial_match ? true : false;
            } catch (e) {

            }

            addressResult.push({
                'address': address,
                'formatted_address': formatted_address,
                'partial_match' : partial_match,
                'valid': valid
            });
        });
    }

    for (var i=0;i&lt;addresses.length;i++) {
        geoCode(addresses[i]);
    }

    var sendResult = function() {
        if (addressResult.length == addresses.length) {
            processing = false;
        }

        if (processing == true) {
            setTimeout(function() { sendResult() } , 50);
        } else {
//            console.log(addressResult);
            res.send(addressResult);
        }
    }

    sendResult();
});
</code></pre>
