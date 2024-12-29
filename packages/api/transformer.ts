import { dinero } from "dinero.js";
import type { Dinero, DineroSnapshot } from "dinero.js";
import superjson from "superjson";
export interface JSONObject {
  [key: string]: JSONValue;
}
export declare type PrimitiveJSONValue =
  | string
  | number
  | boolean
  | undefined
  | null;
export declare type JSONValue = PrimitiveJSONValue | JSONArray | JSONObject;
export interface JSONArray extends Array<JSONValue> {}
/**
 * TODO: Maybe put this in a shared package that can be safely shared between `api`, `nextjs` and `expo` packages
 */
superjson.registerCustom(
  {
    isApplicable: (val): val is Dinero<number> => {
      try {
        // if this doesn't crash we're kinda sure it's a Dinero instance
        (val as Dinero<number>).calculator.add(1, 2);
        return true;
      } catch {
        return false;
      }
    },
    serialize: (val) => {
      return val.toJSON() as JSONValue;
    },
    deserialize: (val) => {
      return dinero(val as DineroSnapshot<number>);
    },
  },
  "Dinero"
);

export const transformer = superjson;
