# Node.js Sentiment Analysis CLI

Sentiment analysis program that analyzes text that is passed in on the command line (either as an additional argument or reading from a file) and prints out the "mood" of the text, including:

- whether it is positive, negative or neutral
- what percentage of each the text is
- what kind of confidence rating it has
- the various emotions and what levels they are at

Word is passed as an argument:

```
node index.js awesome
Your text has the following sentiment (with 95% certainty):

- 100% positive

The emotions found in the text are:

- Joy (100%)
```

Also multiple words are possible:

```
node index.js This is total bullsh*t
Your text has the following sentiment (with 95% certainty):

- 80% negative
- 10% positive
- 10% neutral

The emotions found in the text are:

- Anger (60%)
- Frustration (20%)
- Disgust (15%)
- Confusion (5%)
```

Textfile is passed as an argument:

> [!NOTE]
> Only files with the file extension .txt are recognized as text files.

```
node index.js holiday.txt
Your text has the following sentiment (with 95% certainty):

- 85% positive
- 15% neutral

The emotions found in the text are:

- Joy (60%)
- Excitement (25%)
- Satisfaction (10%)
- Contentment (5%)
```
