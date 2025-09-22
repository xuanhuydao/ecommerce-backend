'use strict'

const { StatusCode, ReasonPhrases } = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
  constructor(message, statusCode, reasonStatus) {
    super(message)
    this.status = statusCode
    this.reason = reasonStatus
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT) {
    super(message, StatusCode.CONFLICT, ReasonPhrases.CONFLICT)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.BAD_REQUEST) {
    super(message, StatusCode.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED) {
    super(message, StatusCode.UNAUTHORIZED)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError
}
