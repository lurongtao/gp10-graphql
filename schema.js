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

const API_BASE = 'http://localhost:9000'

const CommentsType = new GraphQLObjectType({
  name: 'CommentsType',
  fields: {
    id: {
      type: GraphQLInt,
    },
    content: {
      type: GraphQLString
    }
  }
})

const TheaterType = new GraphQLObjectType({
  name: 'TheaterType',
  fields: {
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    }
  }
})

const SubjectType = new GraphQLObjectType({
  name: 'SubjectType',
  fields: {
    id: {
      type: GraphQLInt
    },
    title: {
      type: GraphQLString
    },
    genres: {
      type: GraphQLString
    },
    rating: {
      type: GraphQLFloat
    },
    theater: {
      type: TheaterType,
      resolve(obj) {
        return axios({
          url: `${ API_BASE }/theaters/${obj.theater}`
        })
        .then((result) => {
          return result.data
        })
      }
    },
    comments: {
      type: new GraphQLList(CommentsType),
      resolve(obj) {
        return axios({
          url: `${ API_BASE }/comments/?subject=${obj.id}`
        })
        .then((result) => {
          return result.data
        })
      }
    }
  }
})

const SuccessType = new GraphQLObjectType({
  name: 'SuccessType',
  fields: {
    succ: {
      type: GraphQLString,
      resolve() {
        return '插入数据成功'
      } 
    }
  }
})

const MutationRootType = new GraphQLObjectType({
  name: 'MutationRootType',
  fields: {
    create: {
      type: SuccessType,
      args: {
        title: {
          type: GraphQLNonNull(GraphQLString)
        },
        genres: {
          type: GraphQLNonNull(GraphQLString)
        },
        rating: {
          type: GraphQLNonNull(GraphQLFloat)
        },
        theater: {
          type: GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(obj, args) {
        let {
          title,
          genres,
          rating,
          theater
        } = args
        return axios.post(`${API_BASE}/subjects`, {
          title,
          genres,
          rating,
          theater
        })
        .then(response => response.data)
      }
    },
    update: {
      type: SubjectType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        title: {
          type: GraphQLString
        }
      },
      resolve(obj, args) {
        return axios.patch(`${API_BASE}/subjects/${ args.id }`, {title: args.title})
        .then(response => response.data)
      }
    },
    delete: {
      type: SubjectType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(obj, args) {
        return axios.delete(`${API_BASE}/subjects/${ args.id }`)
          .then(response => response.data)
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world'
        }
      },

      subjects: {
        type: new GraphQLList(SubjectType),
        resolve() {
          return axios({
            url: `${ API_BASE }/subjects`
          }).then((result) => {
            return result.data
          })
        }
      },

      subject: {
        type: SubjectType,
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(obj, args, context) {
          return axios({
            url: `${ API_BASE }/subjects/${args.id}`
          }).then((result) => {
            return result.data
          })
        }
      }
    }
  }),
  
  mutation: MutationRootType
})

export default schema