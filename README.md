# **B-Prism**

## Description

> Map project

## **Introduction**

> Goal: Mitigate disaster effects and efficiently handle disaster response

### **Project Adviser**:

-   Kevin Vega

### **Members:**

-   Martin Edgar Atole
-   Albert Perez

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

### Sample Run

To run all application in development mode, use:

```sh
npm run serve:all-dev
```

To run all application in production mode, use:

```sh
npx run serve:all-prod
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

        |             Package             | Command                               |
        | :-----------------------------: | ------------------------------------- |
        |      _@auth0/nextjs-auth0_      | `npm i @auth0/nextjs-auth0`           |
        |        _@nestjs/common_         | `npm i @nestjs/common`                |
        |         _@nestjs/core_          | `npm i @nestjs/core`                  |
        |   _@nestjs/platform-express_    | `npm i @nestjs/platform-express`      |
        |        _@nestjs/swagger_        | `npm i @nestjs/swagger`               |
        |   _@next-auth/prisma-adapter_   | `npm i @next-auth/prisma-adapter`     |
        |        _@prisma/client_         | `npm i @prisma/client`                |
        |   _@radix-ui/react-accordion_   | `npm i @radix-ui/react-accordion`     |
        | _@radix-ui/react-dropdown-menu_ | `npm i @radix-ui/react-dropdown-menu` |
        |     _@radix-ui/react-icons_     | `npm i @radix-ui/react-icons`         |
        |     _@radix-ui/react-slot_      | `npm i @radix-ui/react-slot`          |
        |       _@types/mapbox-gl_        | `npm i @types/mapbox-gl`              |
        |             _axios_             | `npm i axios`                         |
        |            _bcrypt_             | `npm i bcrypt`                        |
        |       _class-transformer_       | `npm i class-transformer`             |
        |        _class-validator_        | `npm i class-validator`               |
        |   _class-variance-authority_    | `npm i class-variance-authority`      |
        |             _clsx_              | `npm i clsx`                          |
        |         _lucide-react_          | `npm i lucide-react`                  |
        |           _mapbox-gl_           | `npm i mapbox-gl`                     |
        |             _next_              | `npm i next`                          |
        |           _next-auth_           | `npm i next-auth`                     |
        |             _react_             | `npm i react`                         |
        |           _react-dom_           | `npm i react-dom`                     |
        |         _react-map-gl_          | `npm i react-map-gl`                  |
        |       _reflect-metadata_        | `npm i reflect-metadata`              |
        |             _rxjs_              | `npm i rxjs`                          |
        |        _tailwind-merge_         | `npm i tailwind-merge`                |
        |      _tailwindcss-animate_      | `npm i tailwindcss-animate`           |

    - Development Dependencies

        |           Package           | Command                                      |
        | :-------------------------: | -------------------------------------------- |
        |      _@eslint/compat_       | `npm i --save-dev @eslint/compat`            |
        |        _@eslint/js_         | `npm i --save-dev @eslint/js`                |
        |    _@nestjs/schematics_     | `npm i --save-dev @nestjs/schematics`        |
        |      _@nestjs/testing_      | `npm i --save-dev @nestjs/testing`           |
        |        _@nx/eslint_         | `npm i --save-dev @nx/eslint`                |
        |     _@nx/eslint-plugin_     | `npm i --save-dev @nx/eslint-plugin`         |
        |         _@nx/jest_          | `npm i --save-dev @nx/jest`                  |
        |          _@nx/js_           | `npm i --save-dev @nx/js`                    |
        |         _@nx/nest_          | `npm i --save-dev @nx/nest`                  |
        |         _@nx/next_          | `npm i --save-dev @nx/next`                  |
        |         _@nx/node_          | `npm i --save-dev @nx/node`                  |
        |         _@nx/react_         | `npm i --save-dev @nx/react`                 |
        |         _@nx/vite_          | `npm i --save-dev @nx/vite`                  |
        |          _@nx/web_          | `npm i --save-dev @nx/web`                   |
        |        _@nx/webpack_        | `npm i --save-dev @nx/webpack`               |
        |       _@nx/workspace_       | `npm i --save-dev @nx/workspace`             |
        |    _@swc-node/register_     | `npm i --save-dev @swc-node/register`        |
        |         _@swc/cli_          | `npm i --save-dev @swc/cli`                  |
        |         _@swc/core_         | `npm i --save-dev @swc/core`                 |
        |       _@swc/helpers_        | `npm i --save-dev @swc/helpers`              |
        |  _@testing-library/react_   | `npm i --save-dev @testing-library/react`    |
        |       _@types/bcrypt_       | `npm i --save-dev @types/bcrypt`             |
        |        _@types/jest_        | `npm i --save-dev @types/jest`               |
        |        _@types/node_        | `npm i --save-dev @types/node`               |
        |       _@types/react_        | `npm i --save-dev @types/react`              |
        |     _@types/react-dom_      | `npm i --save-dev @types/react-dom`          |
        | _@vitejs/plugin-react-swc_  | `npm i --save-dev @vitejs/plugin-react-swc`  |
        |    _@vitest/coverage-v8_    | `npm i --save-dev @vitest/coverage-v8`       |
        |        _@vitest/ui_         | `npm i --save-dev @vitest/ui`                |
        |       _autoprefixer_        | `npm i --save-dev autoprefixer`              |
        |        _babel-jest_         | `npm i --save-dev babel-jest`                |
        |          _eslint_           | `npm i --save-dev eslint`                    |
        |    _eslint-config-next_     | `npm i --save-dev eslint-config-next`        |
        |  _eslint-config-prettier_   | `npm i --save-dev eslint-config-prettier`    |
        |   _eslint-plugin-import_    | `npm i --save-dev eslint-plugin-import`      |
        |  _eslint-plugin-jsx-a11y_   | `npm i --save-dev eslint-plugin-jsx-a11y`    |
        |    _eslint-plugin-react_    | `npm i --save-dev eslint-plugin-react`       |
        | _eslint-plugin-react-hooks_ | `npm i --save-dev eslint-plugin-react-hooks` |
        |           _jest_            | `npm i --save-dev jest`                      |
        |  _jest-environment-jsdom_   | `npm i --save-dev jest-environment-jsdom`    |
        |   _jest-environment-node_   | `npm i --save-dev jest-environment-node`     |
        |           _jsdom_           | `npm i --save-dev jsdom`                     |
        |            _nx_             | `npm i --save-dev nx`                        |
        |          _postcss_          | `npm i --save-dev postcss`                   |
        |         _prettier_          | `npm i --save-dev prettier`                  |
        |        _tailwindcss_        | `npm i --save-dev tailwindcss`               |
        |          _ts-jest_          | `npm i --save-dev ts-jest`                   |
        |          _ts-node_          | `npm i --save-dev ts-node`                   |
        |           _tslib_           | `npm i --save-dev tslib`                     |
        |        _typescript_         | `npm i --save-dev typescript`                |
        |     _typescript-eslint_     | `npm i --save-dev typescript-eslint`         |
        |           _vite_            | `npm i --save-dev vite`                      |
        |          _vitest_           | `npm i --save-dev vitest`                    |
        |        _webpack-cli_        | `npm i --save-dev webpack-cli`               |

    - Production Dependencies

        | Package | Command        |
        | :-----: | -------------- |
        |  _pm2_  | `npm i -g pm2` |

---

This section provides a comprehensive list of the dependencies used in your project, along with the commands to install them. Adjust the list as needed to fit your specific project requirements.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

Specify the license under which the project is distributed. For example:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
