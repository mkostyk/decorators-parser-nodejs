import { Parser } from "../../src/parse";
import { readFile, readFileSync } from 'fs'

describe("Split by @new tests", () => {
    test("No @new tags", () => {
        let data = readFileSync("__tests__/test.tex", "utf8");
        let parser = new Parser();

        let result = parser.split_by_new(data);
        expect(result).toStrictEqual([data]);
    })

    test("@new tags present", () => {
        let data = readFileSync("__tests__/test_new.tex", "utf8");
        let parser = new Parser();

        let result = parser.split_by_new(data);
        let expected = data.split('@new');
        expect(result).toStrictEqual(expected);
    })
})