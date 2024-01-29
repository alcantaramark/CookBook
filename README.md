# Recipe Search Mobile App

Welcome to the Recipe Search mobile app! This app allows you to search for recipes by name or ingredients, featuring a feed of popular recipes and options to filter by preferences like appetizers and breakfast.


https://github.com/alcantaramark/CookBook/assets/45088718/acd9c7a5-4cfa-44b1-adc2-0379b1d9d106


## Tech Stack

- **Front End:** React Native
- **State Management:** Redux
- **Querying/Caching:** Redux Toolkit Query
- **External APIs:** GraphQL
- **Backend:** C# .NET 7
- **Database:** SQL Server hosted in Azure
- **DevOps:**
  - Backend deployed as an image in GitHub Package Registry
  - Hosted via Azure Container App
  - CI/CD Pipeline: GitHub Actions

## Features

- Search recipes by name or ingredients.
- Explore popular recipes.
- Filter recipes by preferences such as appetizer, breakfast, etc.

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/recipe-search-app.git
   ```

2. Install dependencies:

   ```bash
   cd recipe-search-app
   npm install
   ```

3. Configure backend:

   - Ensure you have a running SQL Server instance in Azure.
   - Update backend configurations accordingly.

4. Start the React Native app:

   ```bash
   npm start
   ```

## Backend Deployment

The backend is deployed as a containerized image stored in the GitHub Package Registry and hosted on Azure Container App. The deployment pipeline is managed using GitHub Actions. To deploy backend as image in your local, you may download docker and docker desktop and execute the following script

```bash
docker build -t spoonstars  .
docker build --build-arg env_instance=Development  -t spoonstars  —no-cache .
docker run --name spoonstars-api -p 80:5013 spoonstars
...

## Contributing

Feel free to contribute to the project by opening issues, submitting pull requests, or suggesting improvements.

## License



This project is licensed under the [MIT License](LICENSE).
```
