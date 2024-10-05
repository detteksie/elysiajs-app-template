import { jsonStringify } from './utils/json-stringify';
import { safewait } from './utils/safewait';

globalThis.jsonStringify = jsonStringify;
globalThis.safewait = safewait;
