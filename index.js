import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:
    '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',
});

const completion = openai.chat.completions.create({
  model: 'gpt-4o-mini',
  store: true,
  messages: [{ role: 'user', content: 'awesome' }],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'text_analysis',
      schema: {
        type: 'object',
        properties: {
          confidenceRating: {
            type: 'number',
            description:
              'The percentage of how certain the AI is that its answer is correct.',
          },
          emotions: {
            type: 'array',
            description:
              'A list of detected moods/sentiments in descending order of percentage.',
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
                    'The percentage indicating the strength of the emotion',
                },
              },
              required: ['name', 'percentage'],
              additionalProperties: false,
            },
          },
        },
        required: ['confidenceRating', 'emotions'],
        additionalProperties: false,
      },
      strict: true,
    },
  },
});

completion.then((result) => {
  const responseContentJSON = JSON.parse(result.choices[0].message.content);
  const confidenceRating = responseContentJSON.confidenceRating;
  const emotionsArray = responseContentJSON.emotions;
  console.log(
    `Your text has the following sentiment (with ${responseContentJSON.confidenceRating}% certainty):\n`,
  );
});
