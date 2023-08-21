import { Parser } from "../../src/parse";
import { readFile, readFileSync } from 'fs'

describe("Parsing global tags tests", () => {
    test("No global tags", () => {
        let data = readFileSync("__tests__/test_no_global.tex", "utf8");
        let parser = new Parser();

        let result = parser.parse_global(data);
        let expected = {
            'data': data,
            'result': {}
        }

        expect(result).toStrictEqual(expected);
    })

    test("Global tags present", () => {
        let data = readFileSync("__tests__/test.tex", "utf8");
        let parser = new Parser();

        let result = parser.parse_global(data);
        let expected = {
            'data': data.replace('@global-topic(History)', ''),
            'result': {
                'topic': 'History'
            }
        }

        expect(result).toMatchObject(expected);
    })
})