# Setup Instructions

1. Clone the repo and `npm install`
2. Generate a personal access token for your GitHub account by going to Settings --> Developer Settings --> Personal Access Tokens. Make sure that the token you generate has full access to repos.
3. Create your `.env` file and add the required variables
4. Run the script with `npm start`

# Env vars
- `TOKEN`: your personal access token for your GH account
- `REPO_PATH`: the path to your repository, like `azjgard/pr-counter`
- `ACTION (optional)`: can be one of three values: 'pull-data', 'analyze-data', or 'pull-and-analyze-data' (which is the default). If you have a lot of data that you're fetching, it can be slow and bandwidth-heavy to fetch all of the data every time you tweak the analysis script. Setting this to `analyze-data` after having running it once will cause the script to just read the data out of the JSON file it gets stored in instead of fetching everything paginated from the API.

# Example .env 
```
TOKEN=xxx-xxx-xxx
REPO_PATH=azjgard/pr-counter
```

