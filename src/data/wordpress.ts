interface WPGraphQLParams {
  query: string;
  variables?: object;
}

export async function fetchAPI({ query, variables = {} }: WPGraphQLParams) {
  const headers = { 'Content-Type': 'application/json' };
  const res = await fetch('https://motion-mat.net/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.log(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}
