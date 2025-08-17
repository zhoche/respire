# Respire — Front-end

Ce dépôt contient le code source front-end du site **Respire — 
Studio de Yoga & Méditation**, développé avec [Vite](https://vite.dev/), 
HTML, CSS et JavaScript.

---

## 🚀 Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) (installé avec Node.js)

---

## 📥 Installation

Clonez le projet :

```bash
git clone https://github.com/zhoche/respire.git
cd respire-front
```

Installez les dépendances :

```bash
npm install
```

---

## 🖥 Lancer le projet en développement

```bash
npm run dev
```

Le site sera disponible à l’adresse indiquée dans le terminal 
(par défaut : [http://localhost:5173](http://localhost:5173)).

---

## 🏗 Build pour la production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

---

## 🔍 Prévisualiser la version de production

```bash
npm run preview
```

---

## 📂 Structure des dossiers

```
respire-front/
│
├── index.html           # Point d’entrée HTML
├── main.js              # Script principal
├── counter.js           # Script d’exemple Vite
├── styles/              # Tous les fichiers CSS (base.css, header.css, etc.)
├── public/images        # Images et icônes du site
└── package.json         # Dépendances et scripts npm
```

---

## ✨ Technologies utilisées

- **[Vite](https://vite.dev/)** — Build tool ultra-rapide
- **HTML5** — Structure du contenu
- **CSS3** (SCSS possible) — Styles et mise en page responsive
- **JavaScript ES6+** — Interactivité et validation de formulaire



# Respire - Back-end

Initialiser le projet Node
npm init -y


Installer Express et quelques outils utiles
npm install express cors dotenv nodemon


Lancer le serveur
npm run dev
Serveur démarré sur http://localhost:5000


Installer Prisma + client
npm i -D prisma
npm i @prisma/client
npx prisma init --datasource-provider sqlite

Créer la base et la table
npx prisma migrate dev --name init_contact_message


Lancer Prisma Studio
npx prisma studio




Étape suivante (anti-spam Redis – résumé ultra-court)
brew install redis && brew services start redis
npm i ioredis rate-limiter-flexible