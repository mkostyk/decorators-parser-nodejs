// Author: Michał Kostyk for Smartschool Inc.
// Date: 2023
// Version: 0.0.4

export class DecoratorNotFoundException extends Error {
    constructor(message, ...args) {
        super(message, ...args);
    }
}

