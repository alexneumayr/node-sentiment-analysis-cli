import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:
    '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',
});

const userInput = process.argv.slice(2).join(' ');

const completion = openai.chat.completions.create({
  model: 'gpt-4o-mini',
  store: true,
  messages: [{ role: 'user', content: userInput }],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'sentiment_analysis',
      schema: {
        type: 'object',
        properties: {
          confidenceRating: {
            type: 'number',
            description:
              'The percentage of how certain the AI is that it correctly detected the Sentiments.',
          },
          sentiments: {
            type: 'array',
            description:
              'Array containing all detected sentiments in descending percentage.',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  enum: ['positive', 'negative', 'neutral'],
                  description: 'The sentiment of the text.',
                },
                percentage: {
                  type: 'number',
                  description: 'The percentage associated with the sentiment.',
                },
              },
              required: ['name', 'percentage'],
              additionalProperties: false,
            },
          },
          emotions: {
            type: 'array',
            description:
              'Array containing all detected emotions in descending percentage.',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description:
                    'The name of the emotion starting with a capital letter.',
                },
                percentage: {
                  type: 'number',
                  description:
                    'The percentage indicating the strength of the emotion.',
                },
              },
              required: ['name', 'percentage'],
              additionalProperties: false,
            },
          },
        },
        required: ['confidenceRating', 'sentiments', 'emotions'],
        additionalProperties: false,
      },
      strict: true,
    },
  },
});

completion.then((result) => {
  const responseContentJSON = JSON.parse(result.choices[0].message.content);
  const confidenceRating = responseContentJSON.confidenceRating;
  const sentimentsArray = responseContentJSON.sentiments;
  const emotionsArray = responseContentJSON.emotions;
  console.log(
    `Your text has the following sentiment (with ${responseContentJSON.confidenceRating}% certainty):\n`,
  );
  sentimentsArray.forEach((sentiment) =>
    console.log(`- ${sentiment.percentage}% ${sentiment.name}`),
  );
});
