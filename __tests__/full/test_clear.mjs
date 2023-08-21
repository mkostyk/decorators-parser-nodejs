import { Parser } from "../../src/parse";

describe("Basic full test", () => {
    test("Correct example", () => {
        let parser = new Parser();

        let result = parser.parse("__tests__/test_clear.tex")
        let expected = {
            'skill': 'address_to_the_young_mans',
            'answers': 'Lines 45-48 (&quot;Unjust... once&quot;)'
        }

        expect(result.length).toBe(1);
        expect(result[0]).toMatchObject(expected);
    })
})