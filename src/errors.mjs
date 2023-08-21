// Author: Michał Kostyk for Smartschool Inc.
// Date: 2023
// Version: 1.2.0

export class DecoratorNotFoundException extends Error {
    constructor(message, ...args) {
        super(message, ...args);
    }
}

