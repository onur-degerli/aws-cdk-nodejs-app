#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const appDir = path.resolve(__dirname, '..');
const prismaSource = path.resolve(appDir, '../../db/orm/generated/prisma');
const distDir = path.resolve(appDir, 'dist');
const generatedTarget = path.resolve(appDir, 'generated');

if (!fs.existsSync(prismaSource)) {
  console.error(`Prisma client assets not found at ${prismaSource}`);
  process.exit(1);
}

fs.mkdirSync(distDir, { recursive: true });

const binaries = fs
  .readdirSync(prismaSource)
  .filter((file) => file.startsWith('libquery_engine') && file.endsWith('.node'));

if (binaries.length === 0) {
  console.error('No Prisma query engine binaries found to copy.');
  process.exit(1);
}

for (const file of binaries) {
  fs.copyFileSync(path.join(prismaSource, file), path.join(distDir, file));
}

fs.rmSync(generatedTarget, { recursive: true, force: true });
fs.mkdirSync(generatedTarget, { recursive: true });

copyRecursive(prismaSource, path.join(generatedTarget, 'prisma'));

function copyRecursive(source, destination) {
  const stats = fs.statSync(source);
  if (stats.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(destination, entry));
    }
  } else {
    fs.copyFileSync(source, destination);
  }
}
