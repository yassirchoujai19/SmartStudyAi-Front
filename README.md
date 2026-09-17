# SmartStudy AI — Frontend

Interface Vue.js 3 de **SmartStudy AI**, une application d'assistance à l'étude qui
centralise les matières et les notes de cours d'un étudiant et met à sa disposition un
assistant conversationnel.

Ce dépôt ne contient que la partie **frontend**. Elle consomme une API REST Laravel
hébergée dans un dépôt séparé.

---

## Stack

- **Vue.js 3** — Composition API
- **Vite** — serveur de développement et build
- **Vue Router** — routage et gardes d'authentification
- **Tailwind CSS v4** — mise en forme
- **Axios** — appels HTTP, avec intercepteurs pour le jeton et les erreurs
- **Lucide** — icônes

Pas de Pinia : l'état global se limite à l'utilisateur connecté, géré par un composable.

---

## Prérequis

```text
Node.js >= 20
npm
```

L'API Laravel doit tourner et être accessible à l'URL configurée dans `.env`.

---

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

L'application démarre sur `http://localhost:5173`.

Si ce port est occupé, Vite bascule automatiquement sur le suivant (5174). Pensez alors
à déclarer cette origine dans la variable `FRONTEND_URL` du backend, sinon le navigateur
bloquera les requêtes (erreur CORS).

### Build de production

```bash
npm run build      # génère dist/
npm run preview    # sert le build localement
```

---

## Variables d'environnement

```env
VITE_API_URL=http://127.0.0.1:8001/api
```

Aucune clé d'API ne doit figurer ici. Tout ce qui est préfixé `VITE_` est recopié dans le
JavaScript compilé et devient **public**. La clé du fournisseur d'IA reste exclusivement
côté serveur : le frontend appelle `POST /api/chat` et ne reçoit que le texte de la
réponse.

---

## Structure

```text
src/
├── components/     Composants réutilisables (cartes, modales, états vides…)
├── composables/    Logique métier partagée (useAuth, useSubjects, useNotes, useChat)
├── layouts/        Gabarit de l'espace authentifié, avec barre latérale
├── router/         Routes et garde d'authentification
├── services/
│   └── api.js      Instance Axios + traduction des erreurs en messages lisibles
├── views/          Pages
└── style.css       Thème Tailwind
```

---

## Pages

| Route | Page | Accès |
|---|---|---|
| `/` | Accueil public | Libre |
| `/login` | Connexion | Visiteur |
| `/register` | Inscription | Visiteur |
| `/app/dashboard` | Tableau de bord | Authentifié |
| `/app/subjects` | Liste des matières | Authentifié |
| `/app/subjects/:id` | Détail d'une matière et ses notes | Authentifié |
| `/app/notes` | Toutes les notes, filtrables | Authentifié |
| `/app/chat` | Assistant IA | Authentifié |
| `/app/settings` | Paramètres du compte | Authentifié |

Les routes `/app/*` sont protégées par une garde de navigation : sans jeton valide,
l'utilisateur est redirigé vers `/login`.

---

## Authentification

Le jeton Laravel Sanctum est conservé dans `localStorage` et rejoué par un intercepteur
Axios sur chaque requête. Une réponse `401` purge le stockage et renvoie vers la page de
connexion.

---

## Compte de démonstration

Si le backend a été initialisé avec ses seeders :

```text
demo@smartstudy.ai / password
```

La page de connexion propose un bouton qui remplit ce compte automatiquement.

---

## Notes d'implémentation

- **Rendu des réponses de l'assistant** — `composables/useMarkdown.js` convertit le
  Markdown renvoyé par l'IA (titres, listes, tableaux, blocs de code). Le texte est
  intégralement échappé avant toute reconstruction de balises : aucun HTML provenant du
  fournisseur n'est interprété.
- **Gestion des erreurs** — `humanError()` dans `services/api.js` traduit chaque code HTTP
  en message français. Aucune trace technique n'est affichée à l'utilisateur.
- **États de chargement** — les listes utilisent des squelettes plutôt qu'un indicateur
  circulaire, afin que la mise en page reste stable pendant le chargement.
- **Responsive** — la barre latérale se replie derrière un bouton de menu sous 1024 px.
