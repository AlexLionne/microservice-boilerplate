12

NPM without access token in repo
This method requires anyone who uses the package to authenticate with their own personal access token rather than a single group token, which allows the repo to be free of access tokens. You also don't need to create a new access token every time a user should no longer be granted access, instead, removing a user from the repo in GitHub will automatically remove their package access.

This is a condensed version of GitHub's NPM guide: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry

Publish Your GitHub Repo as an NPM Package
Create a personal access token in developer settings: https://github.com/settings/tokens
Login to NPM
npm login --scope=@<USERNAME of repo owner in lowercase> --registry=https://npm.pkg.github.com

Username: <Your personal GitHub username>
Password: <Create a GitHub Access Token with your account and paste it here>
Email: <Email associated with the same account>
For example: where user @Bobby wants to publish github.com/Jessica/my-npm-package as an NPM package

npm login --scope=@jessica --registry=https://npm.pkg.github.com

Username: bobby
Password: yiueytiupoasdkjalgheoutpweoiru
Email: bobby@example.com
Update the package.json, following the format below.
"name": "@jessica/my-npm-package",
"repository": "git://github.com/jessica/my-npm-package.git",
"publishConfig": {
"registry":"https://npm.pkg.github.com"
},
To publish the NPM package, run:
npm publish
Install a Private NPM Package in a Project
Login to NPM in the same exact way as step 2 above.
Install the package with npm install @jessica/my-npm-package
Done!

Keep reading if your project will have GitHub Actions scripts that need to install this private NPM package.

GitHub Actions: How to Install a Private NPM Package
In a CI environment, you'll also need npm login to similarly authenticate. Otherwise, npm install will fail, since it doesn't have access to the private NPM package. One way to pre-configure this is to use a .npmrc file; however, this commits auth credentials to the repo with that file. So, another way is to use the NPM tool npm-cli-login. There is a requirement that you either use your own personal access token (not optimal: you leave the repo, CI breaks), or set up a GitHub account specifically for CI and create an access token with that account.

Create an access token with a CI-only GitHub account or grab an access token from your own GitHub account.
Add that access token to your repo as a "secret", in the repo settings.
Update your GitHub Actions workflow script to run this step AFTER you install NPM and BEFORE you run npm install:
- name: Login to GitHub private NPM registry
  env:
  CI_ACCESS_TOKEN: ${{ secrets.NAME_OF_YOUR_ACCESS_TOKEN_SECRET }}
  shell: bash
  run: |
  npm install -g npm-cli-login
  npm-cli-login -u "USERNAME" -p "${CI_ACCESS_TOKEN}" -e "EMAIL" -r "https://npm.pkg.github.com" -s "@SCOPE"

Replace NAME_OF_YOUR_ACCESS_TOKEN_SECRET, USERNAME, EMAIL and SCOPE.

For example

- name: Login to GitHub private NPM registry
  env:
  CI_ACCESS_TOKEN: ${{ secrets.MY_TOKEN }}
  shell: bash
  run: |
  npm install -g npm-cli-login
  npm-cli-login -u "ci-github-account" -p "${CI_ACCESS_TOKEN}" -e "ci-github-account@example.com" -r "https://npm.pkg.github.com" -s "@jessica"
  Done!

Now when GitHub Actions later run npm install, the script will have access to the private NPM package.

FYI: If you're familiar with GitHub Actions, you may ask why can't we use secrets.GITHUB_TOKEN which GitHub automatically supplies? The reason is secrets.GITHUB_TOKEN only has access to the repo that is running the GitHub Actions, it does not have access to the repo of the private NPM package.