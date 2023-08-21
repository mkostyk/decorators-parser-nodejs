import { Parser } from "../../src/parse";

describe("Parser constructor tests", () => {
    test("Empty constructor", () => {
        let parser = new Parser();
        expect(parser.constraints).toStrictEqual({});
        expect(parser.ignored).toStrictEqual([]);
    })

    test("Correct constraint", () => {
        let constraints = {
            'name': {
                'regex': '[a-zA-Z]+',
                'description': 'string of letters'
            }
        };

        let parser = new Parser(constraints);
        expect(parser.constraints).toStrictEqual(constraints);
        expect(parser.ignored).toStrictEqual([])
    })


    test("Correct ignored", () => {
        let ignored = ["line-ref", "some-decorator"];

        let parser = new Parser({}, ignored);
        expect(parser.constraints).toStrictEqual({});
        expect(parser.ignored).toStrictEqual(ignored);
    })


    test("Incorrect constraints", () => {
        let constraints = {
            'name': {
                'regex': '[a-zA-Z]+',
            }
        };

        let testConstructor = () => {
            let parser = new Parser(constraints)
        }

        expect(testConstructor).toThrow("Invalid constraint for key 'name'");
    })
});