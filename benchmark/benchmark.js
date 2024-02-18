import * as ExtendedJSON from '../src/index.js';

const OBJECT_TO_PARSE = `{
	"objName": "Stage",
	"variables": [{
			"name": "NaN",
			"value": "NaN",
			"isPersistent": false
		},
		{
			"name": "Infinity",
			"value": "Infinity",
			"isPersistent": false
		}],
	"costumes": [{
			"costumeName": "backdrop1",
			"baseLayerID": 3,
			"baseLayerMD5": "739b5e2a2435f6e1ec2993791b423146.png",
			"bitmapResolution": 1,
			"rotationCenterX": 240,
			"rotationCenterY": 180
		}],
	"currentCostumeIndex": 0,
	"penLayerMD5": "5c81a336fab8be57adc039a8a2b33ca9.png",
	"penLayerID": 0,
	"tempoBPM": 60,
	"videoAlpha": 0.5,
	"children": [{
			"objName": "Sprite1",
			"scripts": [[88.95,
					68.65,
					[["procDef", "OK %s", ["success info"], [""], false],
						["doAsk", ["concatenate:with:", "OK: ", ["getParam", "success info", "r"]]],
						["stopScripts", "all"]]],
				[97,
					376,
					[["whenGreenFlag"],
						["call", "assertTrue %b %s", ["=", ["readVariable", "NaN"], "NaN"], "NaN support"],
						["call", "assertTrue %b %s", ["=", ["readVariable", "Infinity"], "Infinity"], "Infinity support"],
						["call", "OK %s", ""]]],
				[368.45,
					67.7,
					[["procDef", "FAIL %s", ["error message"], [""], false],
						["doAsk", ["concatenate:with:", "FAIL: ", ["getParam", "error message", "r"]]],
						["stopScripts", "all"]]],
				[92.25,
					208.8,
					[["procDef", "assertTrue %b %s", ["boolean1", "error message"], [false, ""], false],
						["doIf",
							["not", ["getParam", "boolean1", "b"]],
							[["call", "FAIL %s", ["getParam", "error message", "r"]]]]]]],
			"costumes": [{
					"costumeName": "costume1",
					"baseLayerID": 1,
					"baseLayerMD5": "f9a1c175dbe2e5dee472858dd30d16bb.svg",
					"bitmapResolution": 1,
					"rotationCenterX": 47,
					"rotationCenterY": 55
				},
				{
					"costumeName": "costume2",
					"baseLayerID": 2,
					"baseLayerMD5": "6e8bd9ae68fdb02b7e1e3df656a75635.svg",
					"bitmapResolution": 1,
					"rotationCenterX": 47,
					"rotationCenterY": 55
				}],
			"currentCostumeIndex": 0,
			"scratchX": 0,
			"scratchY": 0,
			"scale": 1,
			"direction": 90,
			"rotationStyle": "normal",
			"isDraggable": false,
			"indexInLibrary": 1,
			"visible": true,
			"spriteInfo": {
			}
		},
		{
			"target": "Stage",
			"cmd": "getVar:",
			"param": "NaN",
			"color": 15629590,
			"label": "NaN",
			"mode": 1,
			"sliderMin": 0,
			"sliderMax": 100,
			"isDiscrete": true,
			"x": 5,
			"y": 5,
			"visible": true
		},
		{
			"target": "Stage",
			"cmd": "getVar:",
			"param": "Infinity",
			"color": 15629590,
			"label": "Infinity",
			"mode": 1,
			"sliderMin": 0,
			"sliderMax": 100,
			"isDiscrete": true,
			"x": 5,
			"y": 32,
			"visible": true
		}],
	"info": {
		"scriptCount": 4,
		"flashVersion": "WIN 32,0,0,182",
		"spriteCount": 1,
		"videoOn": false,
		"userAgent": "Scratch 2.0 Offline Editor",
		"swfVersion": "v461"
	}
}`;

const OBJECT_TO_STRINGIFY = JSON.parse(OBJECT_TO_PARSE);

const NUM = 50000;

const benchmark = (fn) => {
  const start = process.hrtime.bigint();
  fn();
  const end = process.hrtime.bigint();
  const totalMS = Number((end - start) / 1000000n);
  const average = totalMS / NUM;
  console.log(`${totalMS}ms total / ${average}ms average`);
  return average;
}

const benchmarkParse = (parse) => benchmark(() => {
  for (let i = 0; i < NUM; i++) {
    parse(OBJECT_TO_PARSE);
  }
});

const benchmarkStringify = (stringify) => benchmark(() => {
  for (let i = 0; i < NUM; i++) {
    stringify(OBJECT_TO_STRINGIFY);
  }
});

process.stdout.write('JSON.parse... ');
const nativeParseAverage = benchmarkParse(JSON.parse.bind(JSON));
process.stdout.write('ExtendedJSON.parse... ');
const customParseAverage = benchmarkParse(ExtendedJSON._parse.bind(ExtendedJSON));
console.log(`JSON.parse is ${(customParseAverage / nativeParseAverage).toFixed(2)}x as fast`);

console.log('');

process.stdout.write('JSON.stringify... ');
const nativeStringifyAverage = benchmarkStringify(JSON.stringify.bind(JSON));
process.stdout.write('ExtendedJSON.stringify... ');
const customStringifyAverage = benchmarkStringify(ExtendedJSON.stringify.bind(ExtendedJSON));
console.log(`JSON.stringify is ${(customStringifyAverage / nativeStringifyAverage).toFixed(2)}x as fast`);
