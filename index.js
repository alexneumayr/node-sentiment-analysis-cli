import fs from 'node:fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:
    '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',
});

const userInput = process.argv.slice(2).join(' ');

function outputFileContent(fileName) {
  const fileInBuffer = fs.readFileSync(fileName);
  const fileAsText = fileInBuffer.toString();
  return fileAsText;
}

const regex = new RegExp('[.]txt$');
let stringToAnalyze;

if (regex.test(userInput)) {
  try {
    stringToAnalyze = outputFileContent(userInput);
  } catch (error) {
    console.log(
      'The following error occurred while processing the text file:\n',
      error,
    );
  }
} else {
  stringToAnalyze = userInput;
}

const completion = openai.chat.completions.create({
  model: 'gpt-4o-mini',
  store: true,
  messages: [{ role: 'user', content: stringToAnalyze }],
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
                  description:
                    'The percentage associated with the sentiment. The percentage of all sentiments combined must equal 100%',
                },
              },
              required: ['name', 'percentage'],
              additionalProperties: false,
            },
          },
          emotions: {
            type: 'array',
            description: 'Array containing all detected emotions.',
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
                    'The percentage indicating the strength of the emotion. The percentage of all emotions combined must equal 100%',
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
  console.log('\nThe emotions found in the text are:\n');
  emotionsArray.forEach((emotion) =>
    console.log(`- ${emotion.name} (${emotion.percentage}%)`),
  );
});
