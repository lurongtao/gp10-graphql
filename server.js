import express from 'express'
import graphqlHTTP from 'express-graphql'
import {
  graphql
} from 'graphql'

import schema from './schema'
import schema2 from './schema2'

const app = express()

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema2,
    graphiql: true,
  }),
)

// app.use('/', (req, res) => {
//   graphql(schema, '{ hello }')
//     .then((result) => {
//       res.send(result)
//     })
// })

app.use('/getSubject', (req, res) => {
  const id  = req.query.id
  console.log(id)
  const query = `{
    subject(id: ${id}) {
      id,
      title
    }
  }`
  graphql(schema, query)
    .then((result) => {
      res.send(result)
    })
})

app.use('/getAll', (req, res) => {
  const query = `{
    subjects {
      id,
      title,
      theater {
        name
      },
      comments {
        content
      }
    }
  }`
  graphql(schema, query)
    .then((result) => {
      res.send(result)
    })
})

app.use('/whatisnew', (req, res) => {
  const query = `{
    
  }`
  graphql(schema2, query)
    .then((result) => {
      res.send(result)
    })
})

app.listen(3300)