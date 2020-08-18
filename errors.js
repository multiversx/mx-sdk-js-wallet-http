class KnownError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);
        this.status = 500;
    }

    toResponse() {
        return {
            code: "error:KnownError",
            message: this.message
        }
    };
}

class BadRequestError extends KnownError {
    constructor(message = "", ...args) {
        super(message, ...args);
        this.status = 400;
    }

    toResponse() {
        return {
            code: "error:BadRequest",
            message: this.message
        }
    };
}

module.exports.KnownError = KnownError;
module.exports.BadRequestError = BadRequestError;
