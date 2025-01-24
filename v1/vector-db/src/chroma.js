import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

const client = new ChromaClient();

console.log("key : ", process.env.OPEN_AI_KEY)

const embedder = new OpenAIEmbeddingFunction(process.env.OPEN_AI_KEY);
const collection = await client.createCollection("first_collection", {}, embedder);

await collection.add(
  ['id1', 'id2'],
  undefined, // embedding
  [{'source': 'from_sandbox'}, {'source': 'form_sandbox2'}], // metadata
  ["this is the vectordb in 100 sec", "vectordb is actually good choice for ai/ml model"] // documents
)

const result = await collection.query(
  undefined,
  2,
  undefined,
  ['what is vectordb?']
)