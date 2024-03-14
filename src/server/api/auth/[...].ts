// file: ~/server/api/auth/[...].ts
import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'

const config = useRuntimeConfig();
const githubClientId = config.githubClientId;
const githubClientSecret = config.githubClientSecret;
const secret = config.secret;

export default NuxtAuthHandler({
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        GithubProvider.default({
           clientId: githubClientId,
           clientSecret: githubClientSecret,
        })
    ]
})

