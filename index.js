const restify = require("restify");
const Facade = require("./facade.js")
const errors = require("./errors.js")

main();

function main() {
    let facade = new Facade()
    let server = createServer(facade);

    server.listen(8080, function () {
        console.log("%s listening at %s", server.name, server.url);
    });
}

function createServer(facade) {
    const server = restify.createServer({
        name: "erdwalletjs",
        version: "1.0.0"
    });

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());

    server.post("/account/new", function (req, res, next) {
        let body = req.body || {};
        let password = body.password;

        try {
            let responsePayload = facade.newAccount(password);
            sendResponse(res, responsePayload);
        } catch (err) {
            sendResponse(res, err);
        }

        return next();
    });

    server.post("/transaction/sign", function (req, res, next) {
        let body = req.body || {};
        let transaction = body.transaction || {};
        let privateKeyHex = body.privateKey;

        try {
            let responsePayload = facade.signTransaction(transaction, privateKeyHex);
            sendResponse(res, responsePayload);
        } catch (err) {
            sendResponse(res, err);
        }

        return next();
    });

    return server;
}

function sendResponse(res, obj) {
    if (obj instanceof Error) {
        if (obj instanceof errors.KnownError) {
            res.send(obj.status, obj.toResponse());
        } else {
            res.send(500, { code: "error:UnknownError", message: `internal error: ${obj.message}` });
        }
    } else {
        res.send(obj.status || 200, { code: "success", data: obj });
    }
}