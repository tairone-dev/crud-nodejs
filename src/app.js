const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();

  const repository = { id, title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories = repositories.map((repository) => {
    if (repository.id !== id) {
      return repository;
    }

    return {
      id,
      title,
      url,
      techs,
      likes: repository.likes,
    };
  });

  return response.json(repositories[repositoryIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories = repositories.map((repository) => {
    if (repository.id !== id) {
      return repository;
    }

    return {
      id,
      title: repository.title,
      url: repository.url,
      techs: repository.techs,
      likes: repository.likes + 1,
    };
  });

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
