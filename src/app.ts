import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  Context,
} from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { AuthResolver } from './api/auth/resolvers'
import { UserResolver } from './api/users/resolvers'

dotenv.config()

async function main() {
  const uri = process.env.MONGO_URI as string
  await mongoose
    .connect(uri)
    .catch(reason => console.error('Database connection failure', { reason }))
  console.log('Database connected')

  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, AuthResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  })

  await apolloServer.start().then(() => {
    console.log(`GraphQL server started`)
  })

  apolloServer.applyMiddleware({ app, cors: false })

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`Express server is started on port ${PORT}`)
  })
}
main().catch(reason => console.error({ reason }))
