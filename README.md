# BlogApp 📝

Une plateforme de blog full-stack moderne où les utilisateurs peuvent lire, écrire et interagir avec des articles.

---

## Captures d'écran

  <img width="900" height="976" alt="image" src="https://github.com/user-attachments/assets/c0dc4e50-d1c8-4a21-836d-4a3fa63269db" />
  <img width="900" height="976" alt="image" src="https://github.com/user-attachments/assets/e522b3c8-3bda-405c-a7b5-78e3f51f0c17" />

<img width="900" height="976" alt="image" src="https://github.com/user-attachments/assets/9448da4c-faab-4dda-8dc1-899ad7ebe89b" />
  <img width="900" height="976" alt="image" src="https://github.com/user-attachments/assets/447992d4-fb5a-4e73-af25-49071e3a94bf" />
<img width="900" height="976" alt="image" src="https://github.com/user-attachments/assets/d1e3aa9b-d4fd-4dbc-9246-bf3d04ab0fa6" />

---

## Fonctionnalités

- 🔐 **Authentification** via Keycloak (SSO)
- 👤 **Gestion des rôles** — USER, AUTHOR, ADMIN
- 📄 **Articles** — Créer, modifier, supprimer et parcourir des articles
- 🔍 **Recherche** — Recherche plein texte sur les articles
- ❤️ **Likes & Commentaires** — Interagir avec les articles
- 👤 **Profil utilisateur** — Modifier sa bio et ses informations personnelles
- 📊 **Dashboard auteur** — Gérer ses articles publiés

---

## Stack technique

### Frontend
| Outil | Utilisation |
|-------|------------|
| Next.js 14+ | Framework React (App Router) |
| TypeScript | Typage statique |
| Material UI (MUI) | Composants UI |
| TanStack Query | Gestion de l'état serveur |
| Axios | Client HTTP |
| Keycloak JS | Authentification |


---

## Structure du projet

```
src/
├── app/                    # Pages Next.js
│   ├── articles/           # Liste et détail des articles
│   ├── dashboard/          # Dashboard auteur
│   └── profile/            # Profil utilisateur
├── components/
│   ├── auth/               # RoleGuard
│   └── layout/             # Navbar, ThemeRegistry
├── features/articles/      # Hooks & API articles
└── lib/
    ├── auth/               # Keycloak, useAuth, roles
    └── api/                # Client Axios
```

---

## Rôles & Permissions

**USER** — Peut lire les articles, laisser des likes et des commentaires.

**AUTHOR** — Tout ce qu'un USER peut faire, en plus de créer, modifier et supprimer ses propres articles. Dispose d'un accès au dashboard personnel.

**ADMIN** — Accès complet. Peut supprimer n'importe quel article, peu importe l'auteur.

---

## Auteur

**Imad Jakhrouti** — [imad@example.com](mailto:imad@example.com)
