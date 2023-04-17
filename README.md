# tarefas.me - dead simple task manager

Supabase and Nuxt3 task manager inspired on original Trello, with only the features I need as solo developer and for really small teams.

I made this for learning [Supabase](https://supabase.com) and [Nuxt 3](https://nuxt.com/docs/getting-started/introduction). Feel free to fork and contribute.

Get in touch via [twitter](https://twitter.com/jnettome) or email on my profile.

The original idea was based on https://github.com/larbish/nuxt3-supabase-example, but since It lacks support for boards, and tags I decided to write this.

![Screenshot of the board preview](/public/bgs/predark.png)


## Setup

Make sure to install the dependencies:

```bash
yarn install
```

After this, create a .env file on project root and set the following with your supabase credentials:

```
SUPABASE_URL="https://fjodmalwswir.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IN4ahTvq0yROlrh2X4w4kKZU_9K7SFl-k"
```

You'll need to run the `init.sql` file on your newly created supabase database.

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
