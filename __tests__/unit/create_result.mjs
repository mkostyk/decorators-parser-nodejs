import { Parser } from "../../src/parse";
import { readFile, readFileSync } from 'fs'

describe("Create result tests", () => {
    test("Correct example", () => {
        let data = readFileSync("__tests__/test_clear.tex", "utf8");
        let parser = new Parser();

        let result = parser.create_result(data, {});
        let expected = {
            'skill': 'address_to_the_young_mans',
            'answers': 'Lines 45-48 (&quot;Unjust... once&quot;)'
        }

        expect(result).toMatchObject(expected);
    })

    test("Unexpected error happening", () => {
        let data = readFileSync("__tests__/test_error.tex", "utf8");
        let parser = new Parser();

        let testFunction = () => {
            parser.create_result(data, {});
        }

        expect(testFunction).toThrow("Duplicate decorator 'skill'");
    })
})