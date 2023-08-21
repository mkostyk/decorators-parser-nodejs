import { Parser } from "../../src/parse";
import { readFileSync } from 'fs'

describe("Removing decorators tests", () => {
    test("No more to remove", () => {
        let data = "@last-decorator(some_value)"
        let parser = new Parser();

        let result = parser.remove_decorator(data)
        let expected = ""

        expect(result).toStrictEqual(expected);
    })

    test("Global tags present", () => {
        let data = readFileSync("__tests__/test.tex", "utf8");
        let parser = new Parser();

        let result = parser.remove_decorator(data);
        // test_no_global.tex is the same as test.tex but with first line cut out.
        let expected = readFileSync("__tests__/test_no_global.tex", "utf8");

        expect(result).toStrictEqual(expected);
    })
})