import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:
    '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',
});

const completion = openai.chat.completions.create({
  model: 'gpt-4o-mini',
  store: true,
  messages: [{ role: 'user', content: 'awesome' }],
});

completion.then((result) => console.log(result.choices[0].message));
