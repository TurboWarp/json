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
  }
];

test('parse', () => { 
  simpleSamples.forEach(({src, obj}) => expect(parse(src)).toStrictEqual(obj));
});

test('_parse', () => {
  simpleSamples.forEach(({src, obj}) => expect(_parse(src)).toStrictEqual(obj));
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
      "a"
      /* AHHHH */
      :
      /*/ aaaaa

        //* 
      // * /

      */
     "// AAAA /* AAAA */"
    //  Test test ////////* Test
    }
    // AAA
    /* AAA */ //`)).toStrictEqual({
    "a": "// AAAA /* AAAA */"
  });
  expect(_parse('"Hello")*(@#&$%R*(IOW#E$R%*(I#Y*(I$#YT*I#ERTGEDLKJHNE$ */ )(#@*!{}')).toEqual('Hello');
  expect(() => _parse('')).toThrow('Unexpected end of input (Line 1 Column 1)');
  expect(() => _parse('[')).toThrow('Unexpected end of input (Line 1 Column 2)');
  expect(() => _parse('{"a":\'\'}')).toThrow("Unexpected character ''' (Line 1 Column 6)")
  expect(() => _parse('"\\0"')).toThrow('Invalid escape code: \\0 (Line 1 Column 3)');
});

test('stringify', () => {
  simpleSamples.forEach(({src, obj}) => expect(stringify(obj)).toBe(src));
  expect(stringify(-0)).toBe('0');
  expect(stringify({
    "an object": {
      "": [
        NaN,
        Infinity,
        -Infinity,
        true,
        false,
        "",
        null,
      ]
    }
  })).toBe('{"an object":{"":[NaN,Infinity,-Infinity,true,false,"",null]}}');
});
