# check out env_required

You need to make a new .env file for yourself and run prisma db push in order to test this out

# discord auth

make sure to set `http://localhost:3000/api/auth/callback/discord`
as a callback in the discrod dev thing

# observed behavior/questions:

running `npm run dev`: clicking on a posts in dev mode has a huge loading time. Why?

running (`npm run build` and `npm run start`) OR deploying on vercel: clicking on a NEW post, results in a 404. Why?
