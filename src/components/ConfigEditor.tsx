import React, { ChangeEvent } from 'react';
import { InlineField, Input, SecretInput } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const { jsonData, secureJsonFields } = options;

  const onEndpointChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        endpoint: event.target.value,
      },
    });
  };

  // Secure field (only sent to the backend)
  const onTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        token: event.target.value,
      },
    });
  };

  const onResetToken = () => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        token: '',
      },
    });
  };

  return (
    <>
      <InlineField label="Endpoint" labelWidth={26} interactive tooltip={'Json field returned to frontend'}>
        <Input
          id="config-editor-endpoint"
          onChange={onEndpointChange}
          value={jsonData.endpoint}
          placeholder="Enter the endpoint, e.g. /api/v1"
          width={40}
        />
      </InlineField>
      <InlineField label="Token" labelWidth={26} interactive tooltip={'Secure json field (backend only)'}>
        <SecretInput
          required
          id="config-editor-token"
          isConfigured={!!jsonData.token}
          value={jsonData?.token}
          placeholder="Enter your token"
          width={40}
          onReset={onResetToken}
          onChange={onTokenChange}
        />
      </InlineField>
    </>
  );
}
