# **B-Prism**

## Description
> Map project

## **Introduction**
> Goal: Aid students in learning programming and mentors in teaching programming.

### **Project Adviser**:
- 

### **Members:**
- Martin Edgar Atole
- Albert Perez

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

## 📂 Project Structure

## Usage

Provide instructions on how to use or run the project. This could include commands to start a development server, build the project, or run tests.

```sh
npm start
```

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

Specify the license under which the project is distributed. For example:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
