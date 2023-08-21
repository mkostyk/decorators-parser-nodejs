// Author: Michał Kostyk for Smartschool Inc.
// Date: 2023
// Version: 0.0.3

import { readFileSync, existsSync } from 'fs'
import { DecoratorNotFoundException } from "./errors.mjs"

const MAGIC_CHAR = '\x07'

export class Parser {
    constructor(constraints={}, ignored=[]) {
        for (const [key, value] of Object.entries(constraints)) {
            // Check if value has regex and description properties
            if (!value.hasOwnProperty('regex') || !value.hasOwnProperty('description')) {
                throw new Error(`Invalid constraint for key '${key}'`);
            }
        }

        this.constraints = constraints;
        this.ignored = ignored;
    }

    parse_ignored(data) {
        for (let ignored_tag of this.ignored) {
            let regex = new RegExp("@" + ignored_tag, 'g');
            let ignored_decorators = [...data.matchAll(regex)];

            if (ignored_decorators.length > 0) {
                for (let ignored_decorator of ignored_decorators) {
                    let decor = ignored_decorator[0];
                    let decor_no_first = decor.substring(1);

                    data = data.replace(decor, MAGIC_CHAR + decor_no_first);
                }
            }
        }

        return data
    }

    restore_ignored(result) {
        for (const [key, value] of Object.entries(result)) {
            result[key] = result[key].replace(new RegExp(MAGIC_CHAR, 'g'), '@');
        }

        return result;
    }

    parse_global(data) {
        let regex = new RegExp("(@global-[^\n]*)", 'g');
        let global_decorators = [...data.matchAll(regex)];
        if (global_decorators.length === 0) {
            return {
                'data': data,
                'result': {}
            };
        }

        let gd_text = "";

        for (let gd of global_decorators) {
            let decor = gd[0];
            data = data.replace(decor, '');
            gd_text += (decor + "\n");
        }

        let gd_result = this.create_result(gd_text);

        return {
            'data': data,
            'result': gd_result,
        }
    }

    split_by_new(data) {
        return data.split('@new');
    }

    remove_decorator(data) {
        let splitted = data.split('@')
        // This means that splitted looks like ['', decorator] right now, so it
        // is the last decorator, and after deletion we want it to be ""
        if (splitted.length <= 2) {
            return "";
        }

        data = '@' + data.split('@').splice(2).join('@')

        return data;
    }

    handle_decorator(data, result) {
        // Look for a decorator
        let decorator = data.match(/@[^\n]*$/m);
        if (!decorator) {
            throw new DecoratorNotFoundException('No more decorators found');
        }

        decorator = decorator[0];

        // Check if decorator is valid
        // TODO - better regex for this
        if (decorator.match(/(@[^\n]*@[^\n]*$)/m)) {
            throw new Error('Invalid decorator');
        }
        
        let is_global = decorator.match(/@global\-[^\n]*/m) ? true : false;
        let name = decorator.split('(')[0].split('@')[1]

        if (is_global) {
            // Removing global- prefix from name
            name = name.replace('global-', '')
        }

        let decor_with_val = decorator // For error messages
        let value = ""

        // Value can be put in brackets or after decorator
        try {
            value = decorator.split('(')[1].split(')')[0].trim()
        } catch (e) {
            // No value found
        }

        if (value == "") {
            // Value is after decorator
            value = data.split(decorator)[1].split('@')[0].trim()
            decor_with_val += value
        }

        if (name in result) {
            throw new Error(`Duplicate decorator '${name}'`)
        }

        if (name in this.constraints) {
            let description = this.constraints[name]['description']

            // Value must be a full match
            if (!value.match(this.constraints[name]['regex'])) {
                throw new Error(`'${name}' should be ${description} but is ${value}`)
            }
        }

        result[name] = value

        return result
    }

    create_result(data, global_dec={}) {
        let result = structuredClone(global_dec);
        while (true) {
            try {
                result = this.handle_decorator(data, result);
            } catch (e) {
                if (e instanceof DecoratorNotFoundException) {
                    // No more decorators
                    break;
                } else {
                    throw e;
                }
            }

            data = this.remove_decorator(data)
        }

        return this.restore_ignored(result)
    }


    parse(file, data) {
        if (file == undefined && data == undefined) {
            throw new Error('Either file or data must be provided')
        }

        if (file != undefined) {
            if (!existsSync(file)) {
                throw new Error(`File '${file}' does not exist`)
            }

            data = readFileSync(file, 'utf8')
        }
        let global_dec = {}

        // Save original data for error line messages
        this.original_data = data
        data = this.parse_ignored(data)

        let global_parsed = this.parse_global(data);
        data = global_parsed.data;
        global_dec = global_parsed.result;

        data = this.split_by_new(data)

        let results_list = []
        for (let d of data) {
            // Handle a single @new object
            results_list.push(this.create_result(d, global_dec))
        }

        return results_list
    }
}