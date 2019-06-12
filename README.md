# ArQmA RPC Daemon and RPC Wallet Javascript Library

[![NPM](https://nodei.co/npm/@arqma/arqma-rpc.png)](https://nodei.co/npm/@arqma/arqma-rpc/)

Javascript library to interact with RPC Daemon and RPC Wallet.\
All requests are queued and use promises.\
The library supports HTTP, HTTPS and digest authentication.

## RPCDaemon
Please refer to the [documentation](https://arqma.github.io/arqma-rpc-js/RPCDaemon.html) and look at the unit tests.\
Init without authentication:
```
let rpcDaemon = new RPCDaemon({
  url: 127.0.0.1:39994
})
```

## RPCWallet
Please refer to the [documentation](https://arqma.github.io/arqma-rpc-js/RPCWallet.html) and look at the unit tests.\
Init with authentication:
```
let rpcWallet = new RPCWallet({
  url: 'http://127.0.0.1:20000',
  username: 'user',
  password: 'pass'
})

```

## Generate JSDoc documentation
```
npm run generate-docs
```

## Get unit tests list
```
npm test
```
