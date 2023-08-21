import { Parser } from "../../src/parse";
import { readFileSync } from 'fs'

describe("Handling single decorator tests", () => {
    test("No more decorators found", () => {
        let data = "";
        let parser = new Parser();

        let testFunction = () => {
            parser.handle_decorator(data, {})
        }

        expect(testFunction).toThrow('No more decorators found');
    })

    test("Invalid decorator", () => {
        let data = "@some-decorator@that-is-wrong";
        let parser = new Parser();

        let testFunction = () => {
            parser.handle_decorator(data, {});
        }

        expect(testFunction).toThrow('Invalid decorator');
    })

    test("Global decorator", () => {
        let data = "@global-topic(History)";
        let parser = new Parser();

        let result = parser.handle_decorator(data, {});
        let expected = {
            'topic': 'History'
        }

        expect(result).toStrictEqual(expected);
    })


    test("Standard decorator - value inside", () => {
        let data = "@skill(issue)";
        let parser = new Parser();

        let result = parser.handle_decorator(data, {});
        let expected = {
            'skill': 'issue'
        }

        expect(result).toStrictEqual(expected);
    })

    // TODO - spell check for parentheses
    test("Standard decorator - value outside with parentheses", () => {
        let data = "@skill()\nissue"
        let parser = new Parser();

        let result = parser.handle_decorator(data, {});
        let expected = {
            'skill': 'issue'
        }

        expect(result).toStrictEqual(expected);
    })


    test("Standard decorator - value outside without parentheses", () => {
        let data = "@skill\nissue";
        let parser = new Parser();

        let result = parser.handle_decorator(data, {});
        let expected = {
            'skill': 'issue'
        }

        expect(result).toStrictEqual(expected);
    })


    test("Duplicate decorator", () => {
        let data = "@skill(not an issue)";
        let parser = new Parser();
        
        // Syntetic result of previous "parsing"
        let prev = {
            'skill': 'issue'
        }

        let testFunction = () => {
            parser.handle_decorator(data, prev);
        }

        expect(testFunction).toThrow("Duplicate decorator 'skill'");
    })


    test("Decorator in constraints - correct value", () => {
        let data = "@skill(issue)";
        let parser = new Parser(
            {
                'skill': {
                    'regex': '^[a-zA-Z]+$',
                    'description': 'string of letters'
                }
            }
        )

        let result = parser.handle_decorator(data, {});
        let expected = {
            'skill': 'issue'
        }

        expect(result).toStrictEqual(expected);
    })


    test("Decorator in constraints - incorrect value", () => {
        let data = "@skill(issue123)"
        let parser = new Parser(
            {
                'skill': {
                    'regex': '^[a-zA-Z]+$',
                    'description': 'string of letters'
                }
            }
        )

        let testFunction = () => {
            parser.handle_decorator(data, {});
        }

        expect(testFunction).toThrow("'skill' should be string of letters but is issue123")
    })
})