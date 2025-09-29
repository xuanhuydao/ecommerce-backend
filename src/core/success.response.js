'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created !'
}

class Successresponse {

    constructor({ message, statusCode = StatusCode.OK, reasonStutusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = message || reasonStutusCode,
            this.status = statusCode,
            this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends Successresponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class CREATED extends Successresponse {
    constructor({ message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata, options }) {
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options 
    }
}

module.exports = {
    OK,
    CREATED,
    Successresponse
}