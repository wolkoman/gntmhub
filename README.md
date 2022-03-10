# GNTMHUB

## Synposis

GNTMHUB is a virtual, just-for-fun stock trading platform for the candidates of the current season Germany's next topmodel. With the in-game currency *g-points* you can buy candidate stocks. If you buy them low and sell them high you can increase your g-points fund. You also get rewarded for buying risky low-performing models with dividends, which are distributed after each episode (there is a fixed dividend pot for every candidate). Extra g-points are rewarded for answering questions for the upcoming episode (as well as submitting question ideas). You can compare your performance with other players in private leaderboard.

## Development

### General information

This project runs on *Next.js* with *React* on the frontend and standard *Typescript* in the backend. It uses a relational database for storage.

### External prerequisites

This project tightly integrates with and requires the following services.

Firstly, we use [**Auth0**](https://auth0.com) as our authentication provider. You just need to create a free Auth0 account and create a new application. Follow the *Next.js* quickstart guide for a fast setup and provide the following enviroment variables in your project: `AUTH0_SECRET`, `AUTH0_BASE_URL` `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`. For detailed infos how to get them, consult the Auth0 documentation.

Secondly, we use [**Prisma Cloud**](https://cloud.prisma.io) as a data proxy. Conveniently you can also setup a free database instance from within the Prisma Cloud setup, so this will be taken care of. Prisma Cloud acts as an intermediary between the application and the database. We need two variables from this setup, the `DATABASE_URL` (which starts with *prisma://*) and the `DIRECT_DATABASE_URL` (which starts with *postgresql://*). Also set an additional environment variable like so: `PRISMA_CLIENT_ENGINE_TYPE='dataproxy'`

### Preparations

Before getting started, make sure to:

1. Configure the external services (see *External prerequisites*) and provide all environment variables in an `.env` file.
2. Install all dependencies via `npm install`
3. Install the Prisma Client via `npm run generate-db-client`
4. Push your database schema via `cross-env DATABASE_URL="<DIRECT_DATABASE_URL>" npx prisma db push`
5. Insert all candidates manually via the [Prisma Cloud Web Interface](https://cloud.prisma.io). (Inserting candidates afterwards may be troublesoume).

### Let's go

You can start local development with `npm run dev`.

## Deployment

This project is deployed via Netlify and its Essential Next.js plugin. In this process, static content is hosted on the Netlify Edge network and dynamic routes are deployed with Amazon Lambda Functions.

## Contributions

You are **more** than welcome to contribute to this project. Just make sure you are getting approval on game altering changes before you put the work in.

## License

This software product can be used under the GNU GPL license.