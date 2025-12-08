/* tslint:disable */
/* eslint-disable */

export class ColorPoint {
  free(): void;
  [Symbol.dispose](): void;
  constructor(r: number, g: number, b: number, a: number);
  r: number;
  g: number;
  b: number;
  a: number;
}

export class ColorPoints {
  free(): void;
  [Symbol.dispose](): void;
  sort_by_all(): void;
  load_from_bytes(bytes: Uint8Array): void;
  get_points_as_bytes(): Uint8Array;
  generate_random_points(count: number, seed?: bigint | null): void;
  len(): number;
  constructor();
  clear(): void;
  sort_by_a(): void;
  sort_by_b(): void;
  sort_by_g(): void;
  sort_by_r(): void;
}

export function create_points(count: number): number;

export function free_points(ptr: number): void;

export function generate_points(ptr: number, count: number): void;

export function get_points_data(ptr: number): Uint8Array;

export function sort_points(ptr: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_colorpoint_free: (a: number, b: number) => void;
  readonly __wbg_colorpoints_free: (a: number, b: number) => void;
  readonly __wbg_get_colorpoint_a: (a: number) => number;
  readonly __wbg_get_colorpoint_b: (a: number) => number;
  readonly __wbg_get_colorpoint_g: (a: number) => number;
  readonly __wbg_get_colorpoint_r: (a: number) => number;
  readonly __wbg_set_colorpoint_a: (a: number, b: number) => void;
  readonly __wbg_set_colorpoint_b: (a: number, b: number) => void;
  readonly __wbg_set_colorpoint_g: (a: number, b: number) => void;
  readonly __wbg_set_colorpoint_r: (a: number, b: number) => void;
  readonly colorpoint_new: (a: number, b: number, c: number, d: number) => number;
  readonly colorpoints_clear: (a: number) => void;
  readonly colorpoints_generate_random_points: (a: number, b: number, c: number, d: bigint) => void;
  readonly colorpoints_get_points_as_bytes: (a: number) => [number, number];
  readonly colorpoints_len: (a: number) => number;
  readonly colorpoints_load_from_bytes: (a: number, b: number, c: number) => void;
  readonly colorpoints_new: () => number;
  readonly colorpoints_sort_by_a: (a: number) => void;
  readonly colorpoints_sort_by_all: (a: number) => void;
  readonly colorpoints_sort_by_b: (a: number) => void;
  readonly colorpoints_sort_by_g: (a: number) => void;
  readonly colorpoints_sort_by_r: (a: number) => void;
  readonly create_points: (a: number) => number;
  readonly free_points: (a: number) => void;
  readonly generate_points: (a: number, b: number) => void;
  readonly get_points_data: (a: number) => [number, number];
  readonly sort_points: (a: number) => void;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
