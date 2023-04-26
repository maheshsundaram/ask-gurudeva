# Ask the Master Course

Ask the Master Course a question and get a natural language response and cited sources.

## Built With

- LangChain
- OpenAI Embeddings and LLM
- Pinecone Vector Store
- TypeScript/Deno/Node

## Preparation

### Data

Fetched all Master Course lessons from [Himalayan Academy](https://www.himalayanacademy.com/livespiritually/become-student/todays-lesson) using `data/get-lessons.ts` and stored in `data/mastercourse.json`

### Embeddings

Used OpenAI Embeddings API to create embeddings for each lesson and lesson type; then indexed embeddings in Pinecone.io. This was done in `notebooks/lessons.ipynb`.

## Asking a Question

Currently as a CLI app only. The future plan is to build a web based UI.

Question is embedded using OpenAI Embeddings API, queried against the Pinecone Index, then relevant documents are provided as context to OpenAI LLM, for which a natural language response is generated.

`npx tsc && node app.js`

```
> What is the dot that Hindus wear on their forehead?

Searching...

Answer: The dot that Hindus wear on their forehead is called a bindi in the Hindi language, bindu in Sanskrit and pottu in Tamil. As found in the following sources: Lesson 310 from Living with Siva and Sutra 296 of the Nandinatha Sutras.
```
