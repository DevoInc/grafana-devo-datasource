/**
 * These types correspond with data and metadata information
 */

/**
 * Basic types
 */
type IntT = 'integer' | 'int' | 'int4' | 'int8';
type FloatT = 'float' | 'float4' | 'float8';
type IpT = 'ip4' | 'ip6';
type TimestampT = 'timestamp';
export type StringT = 'string' | 'str';
type BoolT = 'bool';
type GeocoordT = 'geocoord';
type NullT = 'null';

/**
 * Events
 */
export type Event<T = string | number> = T[];
export type Data<T> = Event<T>[];

/**
 * Metadata
 */
export type DataType =
  | BoolT
  | FloatT
  | GeocoordT
  | IntT
  | IpT
  | NullT
  | StringT
  | TimestampT;

export interface MetadataEntry {
  type: DataType;
  name: string;
  index?: number;
}

export type Metadata = MetadataEntry[];
