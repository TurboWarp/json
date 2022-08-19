import {test, expect} from 'vitest';
import {parse, _parse, stringify} from '../src/index.js';

const simpleSamples = [
  {
    src: '{}',
    obj: {}
  },
  {
    src: '[]',
    obj: []
  },
  {
    src: 'true',
    obj: true
  },
  {
    src: 'false',
    obj: false
  },
  {
    src: 'null',
    obj: null
  },
  {
    src: '0',
    obj: 0
  },
  {
    src: '-10.004',
    obj: -10.004
  },
  {
    src: '20',
    obj: 20
  },
  {
    src: '""',
    obj: ""
  },
  {
    src: '"hello"',
    obj: "hello"
  },
  {
    src: 'Infinity',
    obj: Infinity
  },
  {
    src: '-Infinity',
    obj: -Infinity,
  },
  {
    src: 'NaN',
    obj: NaN
  },
  {
    src: '"❤️✨👩‍👩‍👶‍👦🏄🏿‍♀️"',
    obj: '❤️✨👩‍👩‍👶‍👦🏄🏿‍♀️'
  }
];

test('parse', () => { 
  simpleSamples.forEach(({src, obj}) => expect(parse(src)).toStrictEqual(obj));
});

test('_parse', () => {
  simpleSamples.forEach(({src, obj}) => expect(_parse(src)).toStrictEqual(obj));
  simpleSamples.forEach(({src, obj}) => expect(_parse(`${src})(@#*$)(@#$)`)).toStrictEqual(obj));

  expect(_parse('-0')).toBe(-0);
  expect(_parse(String.raw`
    {
      "an\nobject": {
        "deep list": [1,[[[[[[[[[NaN, [ {"e": true}]]]]]]]]]   ]]
      },
      "": [
        [null],
        {},
        true,
        false,
        -0.00000,
        -1.19,
        1e10,
        "Hello",
        NaN,
        Infinity,
        -Infinity
      ]
    } `
  )).toStrictEqual({
    "an\nobject": {
      "deep list": [1,[[[[[[[[[NaN, [{e: true}]]]]]]]]]]]
    },
    "": [
      [null],
      {},
      true,
      false,
      -0,
      -1.19,
      1e10,
      "Hello",
      NaN,
      Infinity,
      -Infinity
    ]
  });
  expect(_parse(`
    // AAAAA
    {
      //////// AAAAA
      "a"\t\t   \t
      /* AHHHH */
      :
      /*/ aaaaa

        //* 
      // * /

      */
     "// AAAA /* AAAA */"
    //*  Test test ////////* Test
    }
    // AAA
    /* AAA */ //`)).toStrictEqual({
    "a": "// AAAA /* AAAA */"
  });
  expect(_parse('"Hello")*(@#&$%R*(IOW#E$R%*(I#Y*(I$#YT*I#ERTGEDLKJHNE$ */ )(#@*!{}')).toEqual('Hello');
  expect(_parse(`
  [
    "a",
    "b",
  ]
  `)).toStrictEqual(['a', 'b']);
  expect(_parse(`
  {
    "a": "b",
    "c": ["d", "e",],
  }`)).toStrictEqual({
    a: 'b',
    c: ['d', 'e']
  });
  expect(_parse(`{"\\n\\t\\r\\b\\u0000\\"":"\\n\\t\\r\\b\\u0000\\""}`)).toStrictEqual({
    "\n\t\r\b\u0000\"": "\n\t\r\b\u0000\""
  });

  // The exact error message of these tests isn't important, it's just that we want to make sure that
  // the parser is rejecting certain invalid JSON and that the error aren't changing unexpectedly
  // (which could indicate a bug)
  expect(() => _parse('["a""b"]')).toThrow("Expected ']' but found '\"' (Line 1 Column 5)");
  expect(() => _parse('["a",,"b"]')).toThrow("Unexpected character ',' (Line 1 Column 6)")
  expect(() => _parse(`
    {
      "a": "b"
      "c": "d"
    }`)).toThrow("Expected '}' but found '\"' (Line 4 Column 7)");
    expect(() => _parse(`
    {
      "a": "b",,
      "c": "d"
    }`)).toThrow("Expected '\"' but found ',' (Line 3 Column 16)");
  expect(() => _parse('')).toThrow('Unexpected end of input (Line 1 Column 1)');
  expect(() => _parse('[')).toThrow('Unexpected end of input (Line 1 Column 2)');
  expect(() => _parse('{"a":\'\'}')).toThrow("Unexpected character ''' (Line 1 Column 6)")
  expect(() => _parse('"\\0"')).toThrow('Invalid escape code: \\0 (Line 1 Column 3)');
  expect(() => _parse('\n infinity\n')).toThrow("Unexpected character 'i' (Line 2 Column 2)");
  expect(() => _parse('\n -infinity\n')).toThrow("Not a number: - (Line 2 Column 3)");
  expect(() => _parse('\n\tnan\n')).toThrow("Unexpected character 'n' (Line 2 Column 2)");
});

test('stringify', () => {
  simpleSamples.forEach(({src, obj}) => expect(stringify(obj)).toBe(src));
  expect(stringify(-0)).toBe('0');
  expect(stringify({
    "an object": {
      "\"": [
        NaN,
        Infinity,
        -Infinity,
        true,
        false,
        "",
        null,
      ],
      "": 1
    }
  })).toBe('{"an object":{"\\\"":[NaN,Infinity,-Infinity,true,false,"",null],"":1}}');
  expect(stringify({
    a: 1,
    b: undefined,
    c: null,
    d: "Hello \""
  })).toBe(`{"a":1,"c":null,"d":"Hello \\""}`);
  expect(stringify({
    a: undefined,
    b: false
  })).toBe(`{"b":false}`);
  expect(stringify(undefined)).toBe('null');
  expect(stringify([1, undefined, 3])).toBe('[1,null,3]');
  expect(stringify([1, Symbol(), 3])).toBe('[1,null,3]');
  expect(() => stringify(10n)).toThrow('Can not stringify bigint');
});
