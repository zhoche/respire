# Respire — Studio de Yoga & Méditation 🧘‍♀️

Projet full-stack (Front-end + Back-end) développé dans le cadre du **dossier professionnel Graduate Développeur Angular**.

---

## Dépôt

Le projet est organisé en deux dossiers :

```
Respire/
│
├── respire-front/   # Code source front-end (Vite, HTML, CSS, JS)
└── respire-api/     # Code source back-end (Express, Prisma, SQLite, Redis)
```

---

# Front-end

### Prérequis
- [Node.js](https://nodejs.org/) v18 ou supérieur  
- [npm](https://www.npmjs.com/) (fourni avec Node.js)

### Installation
```bash
cd respire-front
npm install
```

### Développement
```bash
npm run dev
```
Le site sera accessible sur [http://localhost:5173](http://localhost:5173).

### Build production
```bash
npm run build
```
Les fichiers optimisés seront générés dans `dist/`.

### Prévisualisation production
```bash
npm run preview
```

### Structure
```
respire-front/
│
├── index.html           # Entrée principale
├── main.js              # Script principal (validation formulaire, fetch API)
├── counter.js           # Script d’exemple Vite
├── styles/              # Feuilles de style (base.css, header.css, etc.)
├── public/images/       # Images & icônes
└── package.json         # Dépendances et scripts npm
```

### Technologies
- [Vite](https://vite.dev/) — Build tool ultra-rapide  
- HTML5 / CSS3 (SCSS possible)  
- JavaScript ES6+  

---

# Back-end (API)

### Prérequis
- [Node.js](https://nodejs.org/) v18 ou supérieur  
- [npm](https://www.npmjs.com/)  
- [SQLite](https://www.sqlite.org/index.html) (inclus via Prisma)  
- [Redis](https://redis.io/) (pour la protection anti-spam)

### Installation
```bash
cd respire-api
npm install
```

### Lancer l’API en développement
```bash
npm run dev
```
API disponible sur [http://localhost:5000](http://localhost:5000).

### Prisma (Base de données)
- Initialiser Prisma :
```bash
npx prisma init --datasource-provider sqlite
```

- Créer la base et la table `ContactMessage` :
```bash
npx prisma migrate dev --name init_contact_message
```

- Ouvrir Prisma Studio (interface graphique BDD) :
```bash
npx prisma studio
```

### Structure
```
respire-api/
│
├── server.js            # Point d’entrée Express
├── prisma/schema.prisma # Schéma de la BDD SQLite
├── prisma/dev.db        # Base SQLite locale
├── .env                 # Variables d’environnement (PORT, CORS_ORIGIN…)
└── package.json         # Dépendances et scripts npm
```

### Technologies
- [Express](https://expressjs.com/) — Framework Node.js minimaliste  
- [Prisma](https://www.prisma.io/) — ORM moderne pour SQLite  
- [CORS](https://www.npmjs.com/package/cors) — Sécurité des appels front/back  
- [Redis](https://redis.io/) + [rate-limiter-flexible](https://www.npmjs.com/package/rate-limiter-flexible) — Protection anti-spam  

---

# Étape suivante
Mise en place d’une **protection anti-spam avec Redis** :  

```bash
brew install redis
brew services start redis
npm install ioredis rate-limiter-flexible
```
