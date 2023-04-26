import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import * as dotenv from "dotenv";

import { PineconeClient } from "@pinecone-database/pinecone";
import { loadQAStuffChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

dotenv.config();

const client = new PineconeClient();

await client.init({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
});

const pineconeIndex = client.Index("mastercourse");

const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  { pineconeIndex }
);

const model = new OpenAI();

const chain = loadQAStuffChain(model);

const rl = readline.createInterface({ input, output });
const query = await rl.question("> ");
rl.close();

const docs = await vectorStore.similaritySearch(query);

// console.log("docs", docs);

const prompt =
  " After the answer, include all of the lesson or sutra numbers from the entire context with the phrase: 'As found in the following sources: '. Say 'Sorry, I cannot find that answer, but you might try the following sources: ' if you do not have any source from the context provided. For both sources statement, do not include the 'Bhashya' title.";

const question = query + prompt;

console.log("\nSearching...\n");

const response = await chain.call({
  input_documents: docs,
  question,
});

console.log(`Answer: ${response.text.trim()}`);
