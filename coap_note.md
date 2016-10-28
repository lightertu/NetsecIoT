## Request / Response Semantics

### Request:
- types
    - GET 
    - PUT 
    - DELETE 
    - POST (idempotent)

- procedure:
    - `coap_pdu_t.hdr.code = methodcode`

- Method definitions:
    = GET:
        * if has Accept option, the data is the preferred content format of a response.
        * if has Etag option, Etag will be validated.

### Responses:
* Respond code:
    - identified by the code field in CoAP header being set to a Response Code.

* types:
    - Piggybacked: ACK also carries reponse message, no seperate message, server decides if it is a piggybacked, so the 
      client needs to be implement both.
    - Seperate: 
    - Token: 
        - used to match a response with a request, The client SHOULD generate tokens in such a way that tokens currently
          in use for a given source/destination endpoint pair are unique.
        - A client sending a request without using Transport Layer Security SHOULD use a nontrivial, randomized token to 
          guard against spoofing of responses
        - A client that is connected to the general Internet SHOULD use at least 32 bits of randomness
        - An endpoint receiving a token it did not generate MUST treat the token as opaque and make no assumptions about 
          its content or structure.



