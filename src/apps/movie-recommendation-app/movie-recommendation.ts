import { IMovie } from './src/interfaces';
import { loadMovies } from './src/packages/load-data';
import { createAndGetMovieStore } from './src/packages/movie-embeddings';
import { createChatbot } from './src/packages/chatbot';

async function main() {
  const movies: IMovie[] = await loadMovies();
  console.log(`✅ Loaded ${movies.length} movies.`);
  const store = await createAndGetMovieStore(movies);
  const chat = await createChatbot(store);

  const response = await chat('Recommend me some science fiction movies like Inception');
  console.log('✅ Response');
  console.log(response);
}

main();
