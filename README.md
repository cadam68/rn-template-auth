# React Native Skeleton Application

This project serves as a solid foundation for building mobile applications, providing essential features like:

🔑 **Authentication**:
- Fully functional Login and Sign-Up workflows.
- Token-based authentication for secure access.

🎨 **Customizable Design**:
- Pre-styled components for a polished UI.
- Easy-to-modify themes and layouts.

⚙️ **Core Features**:
- Structured navigation using react-navigation.
- Integrated form validation.
- Support for splash screens and app initialization flows.

📦 **Development Ready**:
- Built with React Native and Expo for cross-platform compatibility.
- Modular architecture for scalability.
- Includes best practices for state management and API integration.

---

# How to Create a New React Native Expo Project Based on this Template

## Steps

### 1. Clone the Repository
Clone your GitHub repository to your local machine:

```bash
git clone https://github.com/your-username/your-repo-name.git
```

Replace `your-username` and `your-repo-name` with your GitHub username and the name of your repository.

### 2. Navigate to the Project Directory
Move into the cloned repository's folder:

```bash
cd your-repo-name
```

### 3. Install Dependencies
Install the required dependencies listed in the `package.json` file:

```bash
npm install
```

If you're using Yarn, run:

```bash
yarn
```

### 4. Create the .env file
Example:
```
# Variables for Expo (app.config.js)
EAS_PROJECT_ID=[YOUR-EAS-PROJECT-ID]

# Variables for the application (used in components)
API_URL=[YOUR-VALUE]          # Url of the API
API_KEY=[YOUR-VALUE]          # API KEY to identify the request on backend
API_SECURE_KEY=[YOUR-VALUE]   # API SECURE KEY to access to restricted routes on backend
API_DEVICE_KEY=[YOUR-VALUE]   # API DEVICE KEY to identify the origin of the request on backend
```

**Note**:
- The `API_URL`, `API_KEY`, `API_SECURE_KEY`, and `API_DEVICE_KEY` are used in the `FetchService.js`.
- Please refactor the `FetchService.js` according to your needs.

### 5. Start the Expo Development Server
Run the Expo project:

```bash
expo start
```

---

## Customizing the New Project

### a. Update the Project Name
1. Open `app.json` or `app.config.js`.
2. Change the `name` and `slug` fields to the new project's name.

Example:
```json
{
  "expo": {
    "name": "NewProjectName",
    "slug": "new-project-slug",
    ...
  }
}
```

### b. Reset Git History (Optional)
If you want the new project to start fresh without the old Git history:

1. Remove the `.git` folder:
   ```bash
   rm -rf .git
   ```

2. Reinitialize Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for the new project"
   ```

3. Link it to a new GitHub repository:
   ```bash
   git remote add origin https://github.com/your-username/new-repo-name.git
   git push -u origin main
   ```

### c. Install Additional Dependencies
If the new project requires extra dependencies, install them as needed using:

```bash
npm install package-name
```

---

That's it! Have fun!
