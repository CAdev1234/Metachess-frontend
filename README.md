# Gatsby Starter: Typescript + SASS + Redux saga
Starter with the essentials needed for a [Gatsby](https://www.gatsbyjs.org/) site. This setup includes:

- Typescript
- Typescript linting
- SASS support

Install this starter by running this from your [Gatsby CLI](https://next.gatsbyjs.org/tutorial/part-zero/#install-the-gatsby-cli):
```
gatsby new gatsby-site https://github.com/tdharmon/gatsby-starter-typescript-sass
```

# Development
`npm run develop` - port is `8000`.

# Build
`npm run build` - public folder.

# Folder structure
```
Page
/pages/[page-name]/index.tsx
                  /index.scss

Components
/components/[component-name]/index.tsx
                            /index.scss

Additional libraries - used for preparing libraries like sound, stockfish etc.
/lib

Interfaces
/interfaces

Services - used for core functionalities like api, token integration etc.
/services

Reducer & Saga
/store/[store-name]/[store-name].action.ts
                   /[store-name].interfaces.ts
                   /[store-name].reducer.ts
                   /[store-name].saga.ts
Helpers - functions that are independent
/helpers
```

# How it works
Everything is mounted in wrap-with-provider, where is initial logic to set the loader, or to redirect if token is invalid.

When token is set, user will continue on the screen, which is usually choose-mode screen.
If another user wants to join the game, it will be redirected to the join-game screen where we're preparing everything to start the game.

For stockfish, there is a library stockfish.ts and there you can change the values to set the difficuilty.

# Notes
In wrap-with-provider.tsx is initial socket connection to set the user and guest token and eventually to fetch the summary which is done by action.

Whole logic for gameplay is on game page and chessboard wrapper component.

To access to the game screen you need to set the play mode, game rules if playmode is human vs human and game rules inside store.