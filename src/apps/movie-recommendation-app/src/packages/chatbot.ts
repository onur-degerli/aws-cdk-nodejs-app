import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { ConversationalRetrievalQAChain } from '@langchain/classic/chains';
import { BufferMemory } from '@langchain/classic/memory';

export async function createChatbot(store: MemoryVectorStore) {
  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 1,
    model: 'gpt-5-mini',
  });

  const retriever = store.asRetriever();
  const memory = new BufferMemory({
    memoryKey: 'chat_history',
    returnMessages: true,
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(llm, retriever, {
    memory,
  });

  return async (query: string) => {
    const res = await chain.invoke({ question: query });
    return res.text;
  };
}
