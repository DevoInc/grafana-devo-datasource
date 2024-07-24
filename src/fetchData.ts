export const fetchData = (
  endpoint: string,
  token: string,
  from: number,
  to: number,
  query: string
) => {
  return fetch(endpoint + '/query', {
    method: 'POST',
    body: JSON.stringify({
      from: from,
      to: to,
      query: query + ' pragma comment.application: "grafanaPlugin_v3.1.0"',
      mode: {
        type: 'json/compact',
      },
      timeUnit: 'MILLISECONDS',
    }),
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw new Error(error);
    });
};
