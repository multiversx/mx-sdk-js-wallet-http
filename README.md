# erdwalletjs-http

**Work in progress!**

**Work in progress!**

**Work in progress!**

Lighweight HTTP utility to generate accounts and sign transactions for the Elrond Network.

This utility relies on [elrond-core-js](https://github.com/ElrondNetwork/elrond-core-js) to generate accounts and sign transactions.

**This HTTP utility should only be used in secure, off-line, environments. Do not host or use this on a web server.**

## Setup and start

Please make sure you have a recent version of [NodeJS](https://nodejs.org/en/) installed.

```
git clone https://github.com/ElrondNetwork/erdwalletjs-http.git
cd erdwalletjs-http
npm install
node ./index.js
```

Currently, the API will listen to http://localhost:8080 (port not yet configurable).

## API

### Generate an account

One can generate an Elrond account - address, mnemonic, private key and key-file wallet - using the `account/new` route. 

The `password` field is optional, and it will be used to generate the symmetrically encrypted JSON key-file wallet.

**Request:**

```
POST {{baseUrl}}/account/new
Content-Type: application/json

{
    "password": "foobar"
}
```

**Response:**

The response contains the `mnemonic phrase`, plus data derived from it: the private key, the address (in bech32 format). Additionally, a key-file object (the content of the Elrond JSON key-file wallet) is returned. 

```

{
  "code": "success",
  "data": {
    "mnemonic": "home stamp ...",
    "privateKey": "4aa6...",
    "address": "erd1...",
    "keyFilePassword": "foobar",
    "keyFileObject": {
      ...
    }
  }
}
```

### Sign a transaction

**Request:**

Note that the `data` (`memo`) field should be in plain UTF-8. The signing process will encode it in base-64.

The `sender` field must not be set. It will be filled-in by the signing process.

```
{
    "transaction": {
        "nonce": 42,
        "receiver": "erd1...",
        "value": "100000000000000000",
        "gasPrice": 1000000000,
        "gasLimit": 70000,
        "data": "food for cats",
        "chainID": "1",
        "version": 1
    }, 
    "privateKey": "f3062..."
}
```

**Response:**

The response is a ready-to-broadcast Elrond transaction.

Note how the `data` field is encoded in the response.

```
{
  "code": "success",
  "data": {
    "nonce": 42,
    "value": "100000000000000000",
    "receiver": "erd1...",
    "sender": "erd1...",
    "gasPrice": 1000000000,
    "gasLimit": 70000,
    "data": "Zm9vZCBmb3IgY2F0cw==",
    "chainID": "1",
    "version": 1,
    "signature": "7f2e..."
  }
}
```
