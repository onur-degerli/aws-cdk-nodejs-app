import readline from 'readline';
import { IMovie } from './src/interfaces';
import { loadMovies } from './src/packages/load-data';
import { createAndGetMovieStore } from './src/packages/movie-embeddings';
import { createChatbot } from './src/packages/chatbot';

async function main() {
  const movies: IMovie[] = await loadMovies();
  console.log(`✅ Loaded ${movies.length} movies.`);

  const store = await createAndGetMovieStore(movies);
  const chat = await createChatbot(store);

  console.log('🎬 Movie Chatbot ready! Ask me about movies.');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = async () => {
    rl.question('You: ', async (question) => {
      if (['exit', 'quit'].includes(question.trim().toLowerCase())) {
        console.log('👋 Goodbye!');
        rl.close();
        return;
      }

      const response = await chat(question);
      console.log(`🎥 Bot: ${response}\n`);
      ask();
    });
  };

  ask();
}

main();
