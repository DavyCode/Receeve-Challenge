# Receeve Challenge

Scenario:
The scenario is that an email goes out via Mailgun (mailgun.com). Once it’s out, Mailgun
sends various events back (open, clicked, etc). We have sent an email via Mailgun and
now we expect those events sent to us via webhooks, hitting an API Gateway and then that
information is proxied to a Lambda. The Lambda should do two things: save a copy of the
raw webhook and publish a transformed version into SNS.

Your Goal:
Produce the code for a Lambda in AWS. We’ll just zip up the dist or output folder
from the build and let it run. You can pick whatever storage you would like for
storing copies of the webhooks.

Optional:
Feel free to provide AWS resources like a code-file (cloud formation, terraform,
serverless, etc) with definition of Lambda, SNS, DynamoDB, etc - it will
be a bonus points for you

Optional/Very Optional:
Feel free to provide CI/CD delivery like a code-file (cloud formation, terraform,
serverless, etc) with definition of Code pipeline, CodeBuils, etc - it will be a bonus
points for you

---

## Installation/deployment instructions

Follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### `Install Dependencies`

- Run `npm i` to install the project dependencies

### `Provide Environmental Dependencies`

Create `.env` file inside project root and set environment variables.
See sample in env.sample file.

- Run `npm i` to install the project dependencies

### `Deploying to AWS`

You can deploy the function to AWS and all resources will be created for you automatically. Deploying the application is pretty straight forward.

- Ensure you have the AWS Cli installed and configured with the permissions

```sh
npm run deploy
```

### `Remotely`

Copy and replace your `url` - found in Serverless `deploy` command output - and parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/webhook' \
--header 'Content-Type: application/json' \
--data-raw '{
    {
    "signature": {
        "timestamp":"1529006854",
        "token":"a8ce0edb2dd8301dee6c2405235584e45aa91d1e9f979f3de0",
        "signature":"d2271d12299f6592d9d44cd9d250f0704e4674c30d79d07c47a66f95ce71cf55"
    },
    "event-data":{
        "event":"opened",
        "timestamp":1529006854.329574,
        "id":"DACSsAdVSeGpLid7TN03WA"
    }
}
}'
```

### `Building the project`

Build the project for deployment, creates a dist folder in project root

```sh
npm run build
```
