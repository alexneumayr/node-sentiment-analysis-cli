import fs from 'node:fs';
import OpenAI from 'openai';

// Create new OpenAI object to have access to the API
// Important: The API key is now deactivated for security reasons after publishing on GitHub
const openai = new OpenAI({
  apiKey:
    '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',
});

const userInput = process.argv.slice(2).join(' '); // Makes it possible to use multiple words as an argument
const regex = new RegExp('[.]txt$'); // Creates RegEx object to check for a string ending with ".txt"
let stringToAnalyze;

// Function to open a file and return it's content as a string
function outputFileContent(fileName) {
  const fileInBuffer = fs.readFileSync(fileName);
  const fileAsText = fileInBuffer.toString();
  return fileAsText;
}

// Checks if there is at least one argument
if (userInput) {
  // Check if the argument ends with ".txt"
  if (regex.test(userInput)) {
    try {
      stringToAnalyze = outputFileContent(userInput); // If it ends with ".txt" save file content to stringToAnalyze
    } catch (error) {
      // Display error message if there was a problem processing the file
      console.log(
        'The following error occurred while processing the text file:\n',
        error,
      );
    }
  } else {
    // If the argument doesn't end with ".txt" just assign it to stringToAnalyze
    stringToAnalyze = userInput;
  }
} else {
  // If there is no argument output a message and exit the application
  console.log('Error: Please use at least one word as an argument');
  process.exit(0);
}

// Create the gpt request and save it to completion
const completion = openai.chat.completions.create({
  model: 'gpt-4o-mini', // Use gpt-4o-mini
  messages: [{ role: 'user', content: stringToAnalyze }], // Use stringToAnalyze as the content
  response_format: {
    // Specify response scheme
    type: 'json_schema',
    json_schema: {
      name: 'sentiment_analysis',
      schema: {
        type: 'object',
        properties: {
          confidenceRating: {
            type: 'number',
            description:
              'The percentage of how certain the AI is that it correctly detected the sentiments.',
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

// Execute gpt request
completion
  .then((result) => {
    const responseContentJSON = JSON.parse(result.choices[0].message.content); // Save parsed JSON object
    const sentimentsArray = responseContentJSON.sentiments;
    const emotionsArray = responseContentJSON.emotions;
    // Output confidence rating
    console.log(
      `Your text has the following sentiment (with ${responseContentJSON.confidenceRating}% certainty):\n`,
    );
    // Loop through the sentiments array and output name and percentage
    sentimentsArray.forEach((sentiment) =>
      console.log(`- ${sentiment.percentage}% ${sentiment.name}`),
    );
    // Loop through the emotions array and output name and percentage
    console.log('\nThe emotions found in the text are:\n');
    emotionsArray.forEach((emotion) =>
      console.log(`- ${emotion.name} (${emotion.percentage}%)`),
    );
  })
  .catch((error) => console.log(error));
