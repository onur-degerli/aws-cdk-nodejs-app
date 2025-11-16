import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { RetrievalQAChain } from '@langchain/classic/chains';

export async function createChatbot(store: MemoryVectorStore) {
  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 1,
    model: 'gpt-5-mini',
  });

  const chain = RetrievalQAChain.fromLLM(llm, store.asRetriever());

  return async (query: string) => {
    const res = await chain.invoke({ query });
    return res.text;
  };
}
