import gql from 'graphql-tag';
import { GET_CART_ITEMS } from './pages/cart';


export const typeDefs = gql`
    extend type Query {
        isLoggedIn: Boolean!
        cartItems: [Launch]!
    }

    extend type Launch {
        isInCart: Boolean!
    }

    extend type Mutation {
        addOrRemoveFromCart(id: ID!): [Launch]
    }
`;

export const resolvers = {
    Launch: {
        isInCart: (launch, _, { cache }) => {
            const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
            return cartItems.includes(launch.id);
        }
    },
    Mutation: {
        addOrRemoveFromCart: (_, { id }, { cache }) => {
            console.log(`In addOrRemoveFromCart`)
            const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
            console.log(`cartItems=${cartItems}`)
            const data = {
                cartItems: cartItems.includes(id) ? cartItems.filter(i => i !== id)
                                                  : [...cartItems, id]
            }
            console.log(data)
            cache.writeQuery({ query: GET_CART_ITEMS, data });
            let x = cache.readQuery({ query: GET_CART_ITEMS });
            console.log(x)
            return data.cartItems;
        }
    }
}

