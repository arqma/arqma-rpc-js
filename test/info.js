'use strict'

let Reset = '\x1b[0m'
let Blink = '\x1b[5m'

let FgBlack = '\x1b[30m'
let FgGreen = '\x1b[32m'
let FgYellow = '\x1b[33m'
let FgWhite = '\x1b[37m'

let BgBlack = '\x1b[40m'
let BgWhite = '\x1b[47m'

console.log(BgWhite + FgBlack + Blink + '%s' + Reset, 'Several test scripts are available! ')
console.log(FgWhite + BgBlack + 'Use ' + FgGreen + 'npm run' + FgWhite + BgBlack + ' followed by the ' + FgGreen + 'test name.' + Reset)
console.log(BgBlack + FgGreen + 'test-digest' + FgWhite + BgBlack + ' to test ' + FgYellow + 'HTTPDigest library' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcClientWithoutAuth' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCClient library' + FgWhite + BgBlack + ' without authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcClientWithAuth' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCClient library' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcDaemonInputs' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCDaemon inputs parameters' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletInputs' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallet inputs parameters' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcDaemon' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCDaemon functions' + FgWhite + BgBlack + ' without authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletAccount' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 1' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletCreation' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 2' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletHotCold' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 3' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletMining' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 4' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletMulti' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 5' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletMultiTransfer' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 6' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletProofs' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 7' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletRelay' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 8' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletRestore' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 9' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletSweepAll' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 10' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletSweepDust' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 11' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletSweepSingle' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 12' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletTransactionKey' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 13' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletTransfer' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 14' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletTransferSplit' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 15' + FgWhite + BgBlack + ' with authentification ' + Reset)
console.log(BgBlack + FgGreen + 'test-rpcWalletValidateAddress' + FgWhite + BgBlack + ' to test ' + FgYellow + 'RPCWallets functions part 16' + FgWhite + BgBlack + ' with authentification ' + Reset)
