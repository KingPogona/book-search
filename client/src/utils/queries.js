import gql from 'graphql-tag';

export const GET_ME = gql`
  query {
    me{
      username
      bookCount
      savedBooks {
        title
        description
        bookId
        authors
      }
    }
  }
`;
