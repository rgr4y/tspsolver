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
