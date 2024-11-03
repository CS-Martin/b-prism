# **B-Prism**

## Description
> Map project

## **Introduction**
> Goal: Mitigate disaster effects and efficiently handle disaster response

### **Project Adviser**:
- Kevin Vega

### **Members:**
- Martin Edgar Atole
- Albert Perez

## 📂 Project Structure

```plaintext
b-prism
├── apps/                         # Contains various microservices application.
│   ├── authentication-service/   # Authentication service application.
│   ├── client/                   # Client-side application.
│   ├── user-service/             # User service application.
│   └── verification-service/     # Verification service application.
├── libs/                         # Contains shared libraries used across applications.
│   ├── backend/                  # Backend-specific libraries.
│   ├── dto/                      # Data Transfer Object library.
│   └── utils/                    # Utility functions and helpers.
│   └── enums/                    # Enums for entire project
├── dataset/                      # Dataset for map
├── notebooks/                    # Contains jupyter notebook for solution modeling
├── prisma/                       # Config file for Prisma / DB model, DB Connection, etc.
├── .git/                         # Git version control directory
├── .gitignore                    # Git ignore configuration file.
├── nx.json                       # Nx workspace configuration file.
├── package.json                  # Node.js project metadata and dependencies.
└── tsconfig.base.json            # Base TypeScript configuration for the workspace.
```

## Installation

To set up the project, follow these steps:

1. **Navigate to the project directory:**

   ```sh
   cd b-prism/
   ```

2. **Install the dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of your project and add the following contents:

   ```plaintext
   NEXT_PUBLIC_MAPBOX_TOKEN=
   NEXT_PUBLIC_MAPBOX_STYLE=
   DATABASE_URL=

   # Development
   NEXT_PUBLIC_DEV_API_BASE_URL=

   AUTH_SERVICE_API_PORT=
   VERIFICATION_SERVICE_API_PORT=
   USER_SERVICE_API_PORT=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=
   ```

   Make sure to replace the placeholders with your actual configuration values.

4. **Set up the database with Prisma:**

   Push your Prisma schema to the database:

   ```sh
   npx prisma db push
   ```

   Generate the Prisma client:

   ```sh
   npx prisma generate
   ```

## Usage

### Sample Client Run

To run the client application in development mode, use:
  ```sh
  npx nx run client:dev
  ```

### Sample Microservice Run

To run a microservice, such as the authentication service, in development mode, use:
  ```bash
  npx nx run authentication-service:serve:development
  ```
Repeat the above command for other services by replacing `authentication-service` with the desired service name.

---

This setup guide should help you get started with the BPrism project. If you encounter any issues, please refer to the documentation or reach out for support.


Make sure you have [Node.js](https://nodejs.org/) installed on your machine before running the above command.

---

## **Dependencies**

1. **Node**

   - Project Dependencies

     | Package                          | Command                        |
     | :------------------------------: | ------------------------------ |
     | *@auth0/nextjs-auth0*            | `npm i @auth0/nextjs-auth0`    |
     | *@nestjs/common*                 | `npm i @nestjs/common`         |
     | *@nestjs/core*                   | `npm i @nestjs/core`           |
     | *@nestjs/platform-express*       | `npm i @nestjs/platform-express`|
     | *@nestjs/swagger*                | `npm i @nestjs/swagger`        |
     | *@next-auth/prisma-adapter*      | `npm i @next-auth/prisma-adapter`|
     | *@prisma/client*                 | `npm i @prisma/client`         |
     | *@radix-ui/react-accordion*      | `npm i @radix-ui/react-accordion`|
     | *@radix-ui/react-dropdown-menu*  | `npm i @radix-ui/react-dropdown-menu`|
     | *@radix-ui/react-icons*          | `npm i @radix-ui/react-icons`  |
     | *@radix-ui/react-slot*           | `npm i @radix-ui/react-slot`   |
     | *@types/mapbox-gl*               | `npm i @types/mapbox-gl`       |
     | *axios*                          | `npm i axios`                  |
     | *bcrypt*                         | `npm i bcrypt`                 |
     | *class-transformer*              | `npm i class-transformer`      |
     | *class-validator*                | `npm i class-validator`        |
     | *class-variance-authority*       | `npm i class-variance-authority`|
     | *clsx*                           | `npm i clsx`                   |
     | *lucide-react*                   | `npm i lucide-react`           |
     | *mapbox-gl*                      | `npm i mapbox-gl`              |
     | *next*                           | `npm i next`                   |
     | *next-auth*                      | `npm i next-auth`              |
     | *react*                          | `npm i react`                  |
     | *react-dom*                      | `npm i react-dom`              |
     | *react-map-gl*                   | `npm i react-map-gl`           |
     | *reflect-metadata*               | `npm i reflect-metadata`       |
     | *rxjs*                           | `npm i rxjs`                   |
     | *tailwind-merge*                 | `npm i tailwind-merge`         |
     | *tailwindcss-animate*            | `npm i tailwindcss-animate`    |

   - Development Dependencies

     | Package                          | Command                        |
     | :------------------------------: | ------------------------------ |
     | *@eslint/compat*                 | `npm i --save-dev @eslint/compat`|
     | *@eslint/js*                     | `npm i --save-dev @eslint/js`  |
     | *@nestjs/schematics*             | `npm i --save-dev @nestjs/schematics`|
     | *@nestjs/testing*                | `npm i --save-dev @nestjs/testing`|
     | *@nx/eslint*                     | `npm i --save-dev @nx/eslint`  |
     | *@nx/eslint-plugin*              | `npm i --save-dev @nx/eslint-plugin`|
     | *@nx/jest*                       | `npm i --save-dev @nx/jest`    |
     | *@nx/js*                         | `npm i --save-dev @nx/js`      |
     | *@nx/nest*                       | `npm i --save-dev @nx/nest`    |
     | *@nx/next*                       | `npm i --save-dev @nx/next`    |
     | *@nx/node*                       | `npm i --save-dev @nx/node`    |
     | *@nx/react*                      | `npm i --save-dev @nx/react`   |
     | *@nx/vite*                       | `npm i --save-dev @nx/vite`    |
     | *@nx/web*                        | `npm i --save-dev @nx/web`     |
     | *@nx/webpack*                    | `npm i --save-dev @nx/webpack` |
     | *@nx/workspace*                  | `npm i --save-dev @nx/workspace`|
     | *@swc-node/register*             | `npm i --save-dev @swc-node/register`|
     | *@swc/cli*                       | `npm i --save-dev @swc/cli`    |
     | *@swc/core*                      | `npm i --save-dev @swc/core`   |
     | *@swc/helpers*                   | `npm i --save-dev @swc/helpers`|
     | *@testing-library/react*         | `npm i --save-dev @testing-library/react`|
     | *@types/bcrypt*                  | `npm i --save-dev @types/bcrypt`|
     | *@types/jest*                    | `npm i --save-dev @types/jest` |
     | *@types/node*                    | `npm i --save-dev @types/node` |
     | *@types/react*                   | `npm i --save-dev @types/react`|
     | *@types/react-dom*               | `npm i --save-dev @types/react-dom`|
     | *@vitejs/plugin-react-swc*       | `npm i --save-dev @vitejs/plugin-react-swc`|
     | *@vitest/coverage-v8*            | `npm i --save-dev @vitest/coverage-v8`|
     | *@vitest/ui*                     | `npm i --save-dev @vitest/ui`  |
     | *autoprefixer*                   | `npm i --save-dev autoprefixer`|
     | *babel-jest*                     | `npm i --save-dev babel-jest`  |
     | *eslint*                         | `npm i --save-dev eslint`      |
     | *eslint-config-next*             | `npm i --save-dev eslint-config-next`|
     | *eslint-config-prettier*         | `npm i --save-dev eslint-config-prettier`|
     | *eslint-plugin-import*           | `npm i --save-dev eslint-plugin-import`|
     | *eslint-plugin-jsx-a11y*         | `npm i --save-dev eslint-plugin-jsx-a11y`|
     | *eslint-plugin-react*            | `npm i --save-dev eslint-plugin-react`|
     | *eslint-plugin-react-hooks*      | `npm i --save-dev eslint-plugin-react-hooks`|
     | *jest*                           | `npm i --save-dev jest`        |
     | *jest-environment-jsdom*         | `npm i --save-dev jest-environment-jsdom`|
     | *jest-environment-node*          | `npm i --save-dev jest-environment-node`|
     | *jsdom*                          | `npm i --save-dev jsdom`       |
     | *nx*                             | `npm i --save-dev nx`          |
     | *postcss*                        | `npm i --save-dev postcss`     |
     | *prettier*                       | `npm i --save-dev prettier`    |
     | *tailwindcss*                    | `npm i --save-dev tailwindcss` |
     | *ts-jest*                        | `npm i --save-dev ts-jest`     |
     | *ts-node*                        | `npm i --save-dev ts-node`     |
     | *tslib*                          | `npm i --save-dev tslib`       |
     | *typescript*                     | `npm i --save-dev typescript`  |
     | *typescript-eslint*              | `npm i --save-dev typescript-eslint`|
     | *vite*                           | `npm i --save-dev vite`        |
     | *vitest*                         | `npm i --save-dev vitest`      |
     | *webpack-cli*                    | `npm i --save-dev webpack-cli` |

   - Production Dependencies

     | Package | Command |
     | :---: | --- |
     | *pm2* | `npm i -g pm2` |

---

This section provides a comprehensive list of the dependencies used in your project, along with the commands to install them. Adjust the list as needed to fit your specific project requirements.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

Specify the license under which the project is distributed. For example:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
