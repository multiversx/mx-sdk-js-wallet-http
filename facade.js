const core = require("@elrondnetwork/elrond-core-js");
const errors = require("./errors.js")

function Facade() {
    function newAccount(password) {
        password = password || "";

        let account = new core.account();
        let mnemonic = account.generateMnemonic();
        let accountIndex = 0;

        let privateKeyHex = account.privateKeyFromMnemonic(mnemonic, false, accountIndex.toString(), "");
        let privateKey = Buffer.from(privateKeyHex, "hex");
        let keyFileObject = account.generateKeyFileFromPrivateKey(privateKey, password);
        let address = account.address();

        return {
            mnemonic: mnemonic,
            privateKey: privateKeyHex,
            address: address,
            keyFilePassword: password,
            keyFileObject: keyFileObject
        }
    }

    function signTransaction(rawTransaction, privateKeyHex) {
        assertIsSet(rawTransaction, "transaction");
        assertIsSet(rawTransaction.nonce, "transaction.nonce");
        assertIsSet(rawTransaction.chainID, "transaction.chainID");
        assertIsSet(rawTransaction.version, "transaction.version");
        assertIsSet(rawTransaction.gasPrice, "transaction.gasPrice");
        assertIsSet(rawTransaction.gasLimit, "transaction.gasLimit");
        assertIsSet(rawTransaction.receiver, "transaction.receiver");
        assertIsNotSet(rawTransaction.sender, "transaction.sender");
        assertIsSet(privateKeyHex, "private key");

        let privateKey = Buffer.from(privateKeyHex, "hex");
        let account = new core.account();
        account.loadFromSeed(privateKey);

        let transaction = new core.transaction(
            rawTransaction.nonce,
            account.address(),
            rawTransaction.receiver,
            rawTransaction.value,
            rawTransaction.gasPrice,
            rawTransaction.gasLimit,
            rawTransaction.data,
            rawTransaction.chainID,
            rawTransaction.version
        );

        let serializedTransaction = transaction.prepareForSigning();
        transaction.signature = account.sign(serializedTransaction);
        let signedTransaction = transaction.prepareForNode();
        return signedTransaction;            
    }

    return {
        newAccount: newAccount,
        signTransaction: signTransaction
    }
}

function assertIsSet(obj, what) {
    if (!obj) {
        throw new errors.BadRequestError(`${what} must be set.`);
    }
}

function assertIsNotSet(obj, what) {
    if (obj) {
        throw new errors.BadRequestError(`${what} must NOT be set.`);
    }
}

module.exports = Facade;