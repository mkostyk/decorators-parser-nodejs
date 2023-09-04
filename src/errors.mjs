// Author: Michał Kostyk for Smartschool Inc.
// Date: 2023
// Version: 0.0.8

const FAIL = '\x1b[91m'
const ENDC = '\x1b[0m'

class FailException extends Error {
    constructor(message, ...args) {
        super(FAIL + message + ENDC, ...args);
    }
}

export class DecoratorNotFoundException extends FailException {
    constructor(message, ...args) {
        super(message, ...args);
    }
}

export class InvalidConstraintException extends FailException {
    constructor(message, ...args) {
        super(message, ...args);
    }
}

export class DuplicateDecoratorException extends FailException {
    constructor(message, ...args) {
        super(message, ...args);
    }
}

export class InvalidDecoratorException extends FailException {
    constructor(message, ...args) {
        super(message, ...args);
    }
}

export class InvalidValueException extends FailException {
    constructor(message, ...args) {
        super(message, ...args);
    }
}

export class NoDataException extends FailException {
    constructor(message, ...args) {
        super(message, ...args);
    }
}