import { Parser } from "../../src/parse";
import { readFileSync } from 'fs'

const test_file = "__tests__/test.tex"

describe("Parsing ignored tags tests", () => {
    let data = readFileSync(test_file, 'utf8');

    test("No ignored tags", () => {
        let parser = new Parser();

        let ignored_data = parser.parse_ignored(data);
        expect(ignored_data).toStrictEqual(data);
    })

    test("Ignored tags", () => {
        let parser = new Parser({}, ["line-ref"]);

        let ignored_data = parser.parse_ignored(data);
        expect(ignored_data).toStrictEqual(data.replace("@line-ref", "\x07line-ref"));
    })

    test("Ignored tag not in data", () => {
        let parser = new Parser({}, ["line-ref"]);

        let tmp_data = readFileSync("__tests__/test_clear.tex", "utf8");
        let ignored_data = parser.parse_ignored(tmp_data);
        expect(ignored_data).toStrictEqual(tmp_data);
    })
})