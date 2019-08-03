import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql'

import axios from 'axios'

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    user_gender: {
      type: GraphQLString
    },
    user_feeling: {
      type: GraphQLString
    }
  }
})

const AllType = new GraphQLObjectType({
  name: 'AllType',
  fields: {
    id: {
      type: GraphQLInt
    },
    title: {
      type: GraphQLString
    },
    getUserInfo: {
      type: UserType,
      resolve() {
        return axios({
          url: `http://ameker.club:8600/mine/getUserInfo/1`
        }).then((result) => {
          return result.data.userInfo
        })
      }
    }
  }
})

const schema2 = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world'
        }
      },

      getall: {
        type: AllType,
        resolve() {
          return axios({
            url: `http://localhost:9000/subjects/1`
          }).then((result) => {
            return result.data
          })
        }
      }
    }
  })
})

export default schema2