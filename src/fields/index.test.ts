import { createFields } from 'fields';
import { Metadata } from './declarations';
import { FieldType } from '@grafana/data';

const execCases: [string, Metadata, unknown[][], { name: string; type: unknown; values: unknown[] }[]][] = [
  [
    'should create fields with correct types',
    [
      { type: 'timestamp', name: 'time' },
      { type: 'float4', name: 'value' },
      { type: 'bool', name: 'status' },
    ],
    [
      [1623456789000, 42.5, true],
      [1623456790000, 43.2, false],
    ],
    [
      {
        name: 'time',
        type: FieldType.time,
        values: [1623456789000, 1623456790000],
      },
      {
        name: 'value',
        type: FieldType.number,
        values: [42.5, 43.2],
      },
      {
        name: 'status',
        type: FieldType.boolean,
        values: [true, false],
      },
    ],
  ],
  [
    'should handle unknown types',
    [{ name: 'unknown', type: 'null' }],
    [['some value']],
    [
      {
        name: 'unknown',
        type: FieldType.other,
        values: ['some value'],
      },
    ],
  ],
  [
    'should handle empty data',
    [
      { name: 'empty', type: 'str' },
    ],
    [],
    [{
      name: 'empty',
      type: FieldType.string,
      values: [],
    }]
  ]
];

describe('create Fields', () => {
  it.each(execCases)('%s', (_title, metadata, data, expected) => {
    const result = createFields(metadata, data);
    expect(result).toEqual(expected);
  });
});
