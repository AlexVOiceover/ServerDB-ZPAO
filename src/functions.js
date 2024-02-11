// Import the AWS SDK
const AWS = require('aws-sdk')

//Needed for HTTP post to the moderation endpoint URL
const axios = require('axios')

// Configure the region and create a Secrets Manager client
const region = 'eu-west-2' // Replace with your region
const secretName = 'MicrobloggingSecrets' // Replace with your secret name
const client = new AWS.SecretsManager({
	region: region,
})

let cachedSecrets = null

async function getSecrets() {
	if (cachedSecrets) return cachedSecrets

	try {
		const data = await client.getSecretValue({ SecretId: secretName }).promise()
		cachedSecrets = JSON.parse(data.SecretString)
	} catch (error) {
		console.error('Error retrieving secrets:', error)
		throw error
	}
	return cachedSecrets
}

const { OpenAI } = require('openai')
let openai

function sanitize(string) {
	return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

async function moderate(message) {
	try {
		const secrets = await getSecrets()
		// Now that we have the secrets, we can instantiate OpenAI
		if (!openai) {
			openai = new OpenAI({
				apiKey: secrets.OPENAI_API_KEY,
			})
		}

		const response = await axios.post(
			'https://api.openai.com/v1/moderations',
			{ input: message },
			{
				headers: {
					Authorization: `Bearer ${secrets.OPENAI_API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		)

		const results = response.data.results
		console.log(`results from openAI: ${results}`)
		if (results && results.length > 0) {
			const flaggedCategories = Object.keys(results[0].categories).filter((category) => results[0].categories[category])
			console.log(flaggedCategories)
			return flaggedCategories
		} else {
			console.log('No categories were flagged.')
		}
	} catch (error) {
		console.error('Error calling OpenAI moderation:', error)
		throw error // Re-throw the error to handle it upstream if necessary
	}

	return []
}

function formatListWithAnd(array) {
	if (array.length === 0) return ''
	if (array.length === 1) return array[0]
	if (array.length === 2) return array.join(' and ')

	// For more than two elements, join all but the last with a comma, and add 'and' before the last element
	return `${array.slice(0, -1).join(', ')} and ${array[array.length - 1]}`
}

module.exports = { sanitize, moderate, formatListWithAnd }
