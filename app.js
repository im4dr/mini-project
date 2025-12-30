// Import du framework Express
const express = require('express');

// Middleware pour récupérer les données envoyées par formulaire HTML
const bodyParser = require('body-parser');

// Middleware pour pouvoir utiliser PUT et DELETE depuis un formulaire HTML
const methodOverride = require('method-override');

// Initialisation de l'application Express
const app = express();

// Configuration des middlewares
app.use(bodyParser.urlencoded({ extended: true }));

// Permet d'utiliser ?_method=PUT ou ?_method=DELETE
app.use(methodOverride('_method'));

// Port du serveur
const PORT = 3000;

// Tableau contenant les utilisateurs
// Chaque utilisateur possède : id, nom, email, age
let users = [
  { id: 1, nom: 'Ali', email: 'ali@test.com', age: 25 },
  { id: 2, nom: 'Sara', email: 'sara@test.com', age: 30 }
];

// Afficher la liste des utilisateurs
app.get('/users', (req, res) => {
  let html = '<h1>Liste des utilisateurs</h1><ul>';

  users.forEach(u => {
    html += `
      <li>
        ${u.nom} (${u.email}) - ${u.age} ans
        <a href="/user/${u.id}">Voir</a> |
        <a href="/user/${u.id}/edit">Modifier</a>
      </li>
    `;
  });

  html += '</ul>';
  html += '<a href="/user/new">Ajouter un utilisateur</a>';

  res.send(html);
});

// Ajouter un utilisateur (formulaire)
app.get('/user/new', (req, res) => {
  res.send(`
    <h1>Ajouter un utilisateur</h1>
    <form method="POST" action="/user">
      Nom : <input name="nom"><br>
      Email : <input name="email"><br>
      Age : <input type="number" name="age"><br>
      <button>Ajouter</button>
    </form>
  `);
});

// Récupérer un utilisateur par ID
app.get('/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.send('<h2>Utilisateur non trouvé</h2>');
  }

  res.send(`
    <h1>Détails utilisateur</h1>
    <p>Nom : ${user.nom}</p>
    <p>Email : ${user.email}</p>
    <p>Age : ${user.age}</p>
    <a href="/users">Retour</a>
  `);
});

// Traitement du formulaire d'ajout
app.post('/user', (req, res) => {
  const { nom, email, age } = req.body;

  if (!nom || !email || !age) {
    return res.send('<h2>Tous les champs sont obligatoires</h2>');
  }

  const newUser = {
    id: users.length + 1,
    nom,
    email,
    age: parseInt(age)
  };

  users.push(newUser);
  res.redirect('/users');
});

// Modifier un utilisateur (formulaire)
app.get('/user/:id/edit', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.send('<h2>Utilisateur non trouvé</h2>');
  }

  res.send(`
    <h1>Modifier utilisateur</h1>
    <form method="POST" action="/user/${user.id}?_method=PUT">
      Nom : <input name="nom" value="${user.nom}"><br>
      Email : <input name="email" value="${user.email}"><br>
      Age : <input name="age" value="${user.age}"><br>
      <button>Modifier</button>
    </form>
  `);
});

// Mise à jour d'un utilisateur
app.put('/user/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.send('<h2>Utilisateur non trouvé</h2>');
  }

  user.nom = req.body.nom;
  user.email = req.body.email;
  user.age = parseInt(req.body.age);

  res.redirect('/users');
});

// Supprimer un utilisateur
app.delete('/user/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));

  if (index === -1) {
    return res.send('<h2>Utilisateur non trouvé</h2>');
  }

  users.splice(index, 1);
  res.send('<h2>Utilisateur supprimé</h2><a href="/users">Retour</a>');
});

app.get('/', (req, res) => {
  res.send('<h1>Welcome</h1><a href="/users">Go to Users</a>');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
