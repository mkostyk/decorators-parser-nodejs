import { Parser } from "../../src/parse";
import { readFileSync } from "fs";

describe("Testing Windows compatibility", () => {
    test("Endlines replacement", () => {
        let parser = new Parser();

        let result = parser.parse("__tests__/test_windows.tex")
        let expected = {
            'topic': 'History',
            'skill': 'address_to_the_young_mans',
            'answers': 'Lines 45-48 (&quot;Unjust... once&quot;)'
        }

        expect(result.length).toBe(1);
        expect(result[0]).toMatchObject(expected);
    })
})