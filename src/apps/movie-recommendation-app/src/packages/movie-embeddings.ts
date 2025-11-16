import 'dotenv/config';
import path from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { IMovie, IMovieMetadata } from '../interfaces';

const FILE_PATH = path.resolve(__dirname, '../data/tmdb_5000_movies.embeddings.json');

export async function createAndGetMovieStore(movies: IMovie[]): Promise<MemoryVectorStore> {
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  });

  if (existsSync(FILE_PATH)) {
    console.log('✅ Loading cached vectors.');
    const cache: { pageContent: string; metadata: IMovieMetadata; embedding: number[] }[] =
      JSON.parse(readFileSync(FILE_PATH, 'utf8'));

    const store = new MemoryVectorStore(embeddings);
    for (const item of cache) {
      await store.addVectors([item.embedding], [new Document(item)]);
    }
    return store;
  }

  const docs = movies.map(
    (movie) =>
      new Document({
        pageContent: `${movie.title}\n${movie.overview}`,
        metadata: { title: movie.title, genres: movie.genres },
      })
  );

  const vectors = await embeddings.embedDocuments(docs.map((d) => d.pageContent));

  const serializable = docs.map((d, i) => ({
    pageContent: d.pageContent,
    metadata: d.metadata,
    embedding: vectors[i],
  }));

  writeFileSync(FILE_PATH, JSON.stringify(serializable, null, 2), 'utf8');

  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  await store.addVectors(vectors, docs);

  return store;
}
