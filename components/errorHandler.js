
class ErrorHandler extends Error {
    message
    status
    code

    constructor(msg, status, code) {
        super(msg);
        this.message = msg
        this.status = status || 500
        if (code) {
            this.code = code || "Crash"
        }
    }
}

module.exports = ErrorHandler;