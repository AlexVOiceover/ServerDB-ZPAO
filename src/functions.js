require('dotenv').config()

//Needed for HTTP post to the moderation endpoint URL
const axios = require('axios')

const { OpenAI } = require('openai')

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

function sanitize(string) {
	return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

async function moderate(message) {
	try {
		const response = await axios.post(
			'https://api.openai.com/v1/moderations',
			{ input: message },
			{
				headers: {
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
