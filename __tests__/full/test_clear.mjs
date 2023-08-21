import { Parser } from "../../src/parse";
import { readFileSync } from "fs";

describe("Basic full test", () => {
    test("Correct example with file", () => {
        let parser = new Parser();

        let result = parser.parse("__tests__/test_clear.tex")
        let expected = {
            'skill': 'address_to_the_young_mans',
            'answers': 'Lines 45-48 (&quot;Unjust... once&quot;)'
        }

        expect(result.length).toBe(1);
        expect(result[0]).toMatchObject(expected);
    })


    test("Correct example with data", () => {
        let parser = new Parser();

        let data = readFileSync("__tests__/test_clear.tex", 'utf8')
        let result = parser.parse(undefined, data)
        let expected = {
            'skill': 'address_to_the_young_mans',
            'answers': 'Lines 45-48 (&quot;Unjust... once&quot;)'
        }

        expect(result.length).toBe(1);
        expect(result[0]).toMatchObject(expected);
    })

    test("No arguments", () => {
        let parser = new Parser();

        expect(() => {
            parser.parse()
        }).toThrowError("Either file or data must be provided");
    })


    test("File does not exist", () => {
        let parser = new Parser();
        
        expect(() => {
            parser.parse("nonexistent.tex")
        }).toThrowError("File 'nonexistent.tex' does not exist");
    })
})