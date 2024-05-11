'use strict'

const {StatusCodes, ReasonPhrases} = require('../utils/httpStatusCode')

const StatusCode = {...StatusCodes}

const ReasonStatusCode = {
    ...ReasonPhrases
}

class ErrorResponse extends Error {
    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor (message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class InternalServerError extends ErrorResponse{
    constructor (message = ReasonStatusCode.INTERNAL_SERVER_ERROR, statusCode = StatusCode.INTERNAL_SERVER_ERROR) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse{
    constructor (message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse{
    constructor (message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse{
    constructor (message = ReasonStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse{
    constructor (message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class TooManyRequest extends ErrorResponse{
    constructor (message = ReasonStatusCode.TOO_MANY_REQUESTS, statusCode = StatusCode.TOO_MANY_REQUESTS) {
        super(message, statusCode)
    }
}

class RequestTooLong extends ErrorResponse{
    constructor (message = ReasonStatusCode.REQUEST_TOO_LONG, statusCode = StatusCode.REQUEST_TOO_LONG) {
        super(message, statusCode)
    }
}




module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
    TooManyRequest,
    RequestTooLong,
    InternalServerError
}