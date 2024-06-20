class ServerError extends Error {
    constructor() {
        super('Internl server error');
        this.name = 'ServerError';
        this.statusCode = 500;
    }
}

class UnauthorizedError extends Error {
    constructor() {
        super('UnauthorizedError error');
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}

class NotFoundError extends Error {
    constructor() {
        super('Not found');
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

class BadRequestError extends Error {
    constructor() {
        super('Bad request');
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}

class UsernameOrPasswdordError extends BadRequestError {
    constructor() {
      super();
      this.message = "Incorrect username or password."
    }
  }  

class NameInUseError extends BadRequestError {
    constructor() {
        super();
        this.message = 'Name is already in use.';
    }
}

class EmailInUseError extends BadRequestError {
    constructor() {
        super();
        this.message = 'Email is already in use.';
    }
}

class EmptyFieldsError extends BadRequestError {
    constructor(fieldName) {
        super();
        this.message = `${fieldName} required.`;
    }
}


module.exports = {
    ServerError,
    UnauthorizedError,
    NotFoundError, 
    BadRequestError,
    UsernameOrPasswdordError,
    NameInUseError,
    EmailInUseError,
    EmptyFieldsError,
};