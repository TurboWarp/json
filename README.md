# @turbowarp/json

This library is intended to parse the non-standards compliant JSON found in some Scratch 2 projects.

Install from npm:

```bash
npm install @turbowarp/json
```

Then pick your favorite way to import it:

```js
import {parse, stringify} from '@turbowarp/json';
import * as ExtendedJSON from '@turbowarp/json';
const ExtendedJSON = require('@turbowarp/json');
```

parse() will convert a JSON string to an object like JSON.parse(). Does not support replacer. It will first try to use JSON.parse, and only if that fails, it will fallback to our custom JSON parser.

_parse() is the same as parse() except it always uses our custom JSON parser.

stringify() will convert a JSON object to a string like JSON.stringify(). Does not support replacer or formatting.
