import * as v from "valibot";

type ToArray<Input> = Input extends Array<infer Item> ? Array<Item> : Array<Input>;

/**
 * Normalizes a single value or an array to an array in a Valibot pipeline. This is useful because one query occurrence
 * arrives as a string while repeated occurrences arrive as an array. Combine item-level validation with `v.nonEmpty()`
 * when empty strings or empty arrays should be rejected.
 */
export function toArray<Input>(): v.TransformAction<Input, ToArray<Input>> {
	return v.transform((input: Input) => (Array.isArray(input) ? input : [input]) as ToArray<Input>);
}
