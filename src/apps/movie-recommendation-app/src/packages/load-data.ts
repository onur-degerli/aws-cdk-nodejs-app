import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { IMovie } from '../interfaces';

const FILE_PATH = path.resolve(__dirname, '../data/tmdb_5000_movies.csv');

export async function loadMovies(): Promise<IMovie[]> {
  return new Promise((resolve, reject) => {
    const results: IMovie[] = [];

    fs.createReadStream(FILE_PATH)
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        results.push({
          id: Number(row.id),
          title: row.title,
          overview: row.overview,
          genres: row.genres,
          cast: row.cast,
          crew: row.crew,
        });
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
}
