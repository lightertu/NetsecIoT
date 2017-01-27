var coap        = require('coap')
  , server      = coap.createServer({ type: 'udp6' })

server.on('request', function(req, res) {
  res.end('Hello ' + req.url.split('/')[1] + '\n')
})

// the default CoAP port is 5683
server.listen(function() {
  var req = coap.request('coap://[fe80::a490:2aff:fef7:ecb]/Matteo')

  req.on('response', function(res) {
    res.pipe(process.stdout)
    res.on('end', function() {
      process.exit(0)
    })
  })

  req.end()
})
