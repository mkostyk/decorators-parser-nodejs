import { Parser } from "../../src/parse";
import { readFileSync } from 'fs'

const test_file = "__tests__/test.tex"

describe("Restoring ignored tags tests", () => {
    let data = {
        'name': 'blabla',
        'skill': 'some weird \x07value'
    }

    let expected = {
        'name': 'blabla',
        'skill': 'some weird @value'
    }

    test("No ignored tags", () => {
        let parser = new Parser();

        let results = parser.restore_ignored(data);
        expect(results).toStrictEqual(expected);
    })

    test("Ignored tags", () => {
        let parser = new Parser({}, ["line-ref", "skill"]);

        let results = parser.restore_ignored(data);
        expect(results).toStrictEqual(expected);
    })
})