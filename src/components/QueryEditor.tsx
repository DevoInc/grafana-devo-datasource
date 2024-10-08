import React, { ChangeEvent } from 'react';
import { InlineField, Input, Stack } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const { queryText } = query;

  const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, queryText: event.target.value });
  };

  const onChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    onRunQuery();
  };

  return (
    <Stack gap={0}>
      <InlineField label="Query Text" labelWidth={16} tooltip="Not used yet">
        <Input
          id="query-editor-query-text"
          onChange={onQueryTextChange}
          onBlur={onChangeQuery}
          value={queryText || ''}
          required
          placeholder="Enter a query"
        />
      </InlineField>
    </Stack>
  );
}
