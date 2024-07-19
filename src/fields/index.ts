import { FieldType } from '@grafana/data';

import { Metadata } from './declarations';

export const createFields = (metadata: Metadata, data: unknown[][]) => {
  const mapType: { [key: string]: string } = {
    timestamp: FieldType.time,
    str: FieldType.string,
    int4: FieldType.number,
    int8: FieldType.number,
    float4: FieldType.number,
    float8: FieldType.number,
    bool: FieldType.boolean,
    geocoord: FieldType.geo,
  };
  const fields: { name: string; type: unknown; values: unknown[] }[] = [];

  for (const m of metadata) {
    fields.push({ name: m.name, type: mapType[m.type] ?? FieldType.other, values: [] });
  }

  for (const d of data) {
    for (const index of d.keys()) {
      fields[index].values.push(d[index]);
    }
  }
  return fields;
};
