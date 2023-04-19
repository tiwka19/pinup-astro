interface WPGraphQLParams {
	query: string
	variables?: object
}

export async function wpquery({ query, variables = {} }: WPGraphQLParams) {
	const res = await fetch('https://motion-mat.net/graphql', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	})

	if (!res.ok) {
		console.error(res)
		return {}
	}

	const { data } = await res.json()

	return data
}
