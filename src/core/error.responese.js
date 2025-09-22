'use strict'

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500
}

const ReasonStatusCode = {
  FORBIDDEN: 'Forbidden',
  CONFLICT: 'Conflict',
  BAD_REQUEST: 'Bad Request',
  INTERNAL_ERROR: 'Internal Server Error'
}

class ErrorResponse extends Error {
  constructor(message, statusCode, reasonStatus) {
    super(message)
    this.status = statusCode
    this.reason = reasonStatus
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT) {
    super(message, StatusCode.CONFLICT, ReasonStatusCode.CONFLICT)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.BAD_REQUEST) {
    super(message, StatusCode.BAD_REQUEST, ReasonStatusCode.BAD_REQUEST)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError
}
