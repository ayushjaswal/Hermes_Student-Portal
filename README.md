# Student Portfolio Management

This project is a JavaScript application built using the React library.

## To Run the Project

1. Clone the repository.
2. Run `yarn` and then run `yarn modules`
3. Run `yarn dev` to start the development server.

## Important Points to Note

- **Package Manager**: Use Yarn instead of npm for managing dependencies.
- **Development Environment**: The project uses Vite for frontend; ensure you are using it for development.
- **API Keys**: The `.env.example` file contains dummy API keys. Replace them with your own for development and app management. If integrating private APIs, list them in `.env.example`.
- **Single Repository**: It is a single repository containing both server and client for the project. The running command `yarn dev` allows you to run both the apps but to install specific packages you need to go to the specific directory. 
- Similarly the command `yarn` installs packages that are just for good developer experience. But `yarn modules` installs packages for both the apps. Both commands are required to run. 
