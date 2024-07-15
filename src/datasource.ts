import { isFetchError } from '@grafana/runtime';
import {
  CoreApp,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  toDataFrame,
} from '@grafana/data';

const sdkClient = require('@devoinc/browser-sdk');

export const defaultQuery: Partial<MyQuery> = {
  constant: 6.5,
};

import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';
import _, { defaults } from 'lodash';
import { createFields } from 'fields';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  baseUrl: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.baseUrl = instanceSettings.url!;
    this.serreaClient = sdkClient.client({
      url: instanceSettings.jsonData.endpoint,
      token: `bearer ${instanceSettings.jsonData.token}`,
    });
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  filterQuery(query: MyQuery): boolean {
    // if no query has been provided, prevent the query from being executed
    return !!query.queryText;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const promises = options.targets.map(async (target) => {
      const query = defaults(target, defaultQuery);

      const result = query?.queryText
        ? await this.serreaClient
            .query({
              query: query.queryText + ' pragma comment.application: "grafanaPlugin_v3.0.0"',
              dateFrom: from,
              dateTo: to,
              format: 'json/compact',
            })
            .then((result) => result)
            .catch((error) => console.error('Query failed: %s', error))
        : {};

      return toDataFrame({
        refId: query.refId,
        fields: query?.queryText ? createFields(result.object.metadata, result.object.d) : [],
      });
    });

    return Promise.all(promises).then((data) => ({ data }));
  }

  async request(url: string, params?: string) {
    const now = new Date().getTime();
    return this.serreaClient
      .query({
        query: 'from demo.ecommerce.data select eventdate,protocol,statusCode,method limit 1',
        dateFrom: now - 1,
        dateTo: now,
      })
      .then((result) => {
        return { ...result, status: 200 };
      })
      .catch((error) => {
        return { status: 1, statusText: error };
      });
  }

  /**
   * Checks whether we can connect to the API.
   */
  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await this.request('/search');
      debugger;
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
