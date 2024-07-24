// @ts-nocheck
import { isFetchError } from '@grafana/runtime';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  toDataFrame,
} from '@grafana/data';

export const defaultQuery: Partial<MyQuery> = {
  constant: 6.5,
};

import { MyQuery, MyDataSourceOptions } from './types';
import _, { defaults } from 'lodash';
import { createFields } from 'fields';
import { fetchData } from './fetchData';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.endpoint = instanceSettings.jsonData.endpoint;
    this.token = `bearer ${instanceSettings.jsonData.token}`;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;

    const promises = options.targets.map(async (target) => {
      const query = defaults(target, defaultQuery);
      if (query.queryText) {
        const result = await fetchData(
          this.endpoint,
          this.token,
          range!.from.valueOf(),
          range!.to.valueOf(),
          query.queryText
        );

        if (result.error) {
          throw new Error(`Status: ${result.status}, message: ${result.error}`);
        } else {
          return toDataFrame({
            refId: query.refId,
            fields: query?.queryText ? createFields(result.object.metadata, result.object.d) : [],
          });
        }
      } else {
        return [];
      }
    });

    return Promise.all(promises).then((data) => ({ data }));
  }

  async request(url: string, params?: string) {
    const now = new Date().getTime();
    const result = fetchData(
      this.endpoint,
      this.token,
      now - 1000,
      now,
      'from siem.logtrust.web.activity select eventdate limit 1'
    );

    if (result.error) {
      return { status: 1, statusText: result.error };
    } else {
      return { ...result, status: 200 };
    }
  }

  /**
   * Checks whether we can connect to the API.
   */
  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await this.request('/search');
      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message: response.statusText ? response.statusText : defaultErrorMessage,
        };
      }
    } catch (err) {
      let message = '';
      if (_.isString(err)) {
        message = err;
      } else if (isFetchError(err)) {
        message = 'Fetch error: ' + (err.statusText ? err.statusText : defaultErrorMessage);
        if (err.data && err.data.error && err.data.error.code) {
          message += ': ' + err.data.error.code + '. ' + err.data.error.message;
        }
      }
      return {
        status: 'error',
        message,
      };
    }
  }
}
