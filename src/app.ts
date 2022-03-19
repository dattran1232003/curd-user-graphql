import 'reflect-metadata'

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import express from 'express'

import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  Context,
} from 'apollo-server-core'

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
      resolvers: [UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, cors: false })

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`Express server is started on port ${PORT}`)
    console.log(
      `GraphQL server listening on port http://localhost:${PORT}${apolloServer.graphqlPath}`
    )
  })
}
main().catch(reason => console.error({ reason }))
