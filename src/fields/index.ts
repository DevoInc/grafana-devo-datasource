// @ts-nocheck
import { FieldType } from '@grafana/data';

export const createFields = (metadata, data) => {
  const mapType = {
    timestamp: FieldType.time,
    str: FieldType.string,
    int4: FieldType.number,
    int8: FieldType.number,
    float4: FieldType.number,
    float8: FieldType.number,
    bool: FieldType.boolean,
    geocoord: FieldType.geo,
  };
  const fields = [];

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
