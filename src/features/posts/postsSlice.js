import { 
    createSlice, 
    //nanoid, 
    createAsyncThunk, 
    createSelector, 
    createEntityAdapter 
} from '@reduxjs/toolkit';
import { client } from '../../api/client'
//import { add, sub } from 'date-fns';


const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
})
//create a middleware and thunk function
//**postSlice store look like {posts, status, error}
/*
const initialState = {
    posts: [],
    status: 'idle', 
    error: null
}*/
//making a Normalized state by with createEntityAdapter
//getInitialState() returns an empty {ids: [], entities: {}} normalized state object. 
const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null,
})

//without thunk
/*
const initialState = [
    {
        id:'1', 
        title: 'first post', 
        content: 'hello',
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0
        }
    },
    {
        id:'2', 
        title: 'secound post', 
        content: 'more text',
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0
        }
    },
];
*/


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts')
    //console.log('fetch run')
    //console.log(response.data)
    return response.data
})

export const addNewPost = createAsyncThunk(
    'posts/addNewPost', 
    async initialPost => {
        const response = await client.post('/fakeApi/posts', initialPost)
        return response.data
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
                const { postId, reaction } = action.payload
                //normalized

                const existingPost = state.entities[postId]
                /* 
                //To avoid re-render all list even the list has no changing, 
                //we use normalized way, see code in front line
                const existingPost = state.posts.find(post => post.id === postId)
                */
                //const existingPost = selectPostById(state, postId)
                /*
                const existingPost = state.find(post => post.id === postId)
                */
                console.log(existingPost)
                if(existingPost) {
                    existingPost.reactions[reaction]++
                }
            },

        /*
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
                
                //without middleware, thunk
                
                //state.push(action.payload)
                
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId
                    }
                }
            }
        },
        */
        /*
        postAdded(state, action) {
            state.push(action.payload)
        },
        */

        postUpdated(state, action) {
            const { id, title, content } = action.payload;
            const existingPost = state.entities[id]
            /*
            const existingPost = state.posts.find(post => post.id === id)
            */
            //without middleware and thunk
            /*s
            const existingPost = state.find(post => post.id === id);
            */

            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content
            }
        }
    },

    //The builder object provides methods that let us define 
    //additional case reducers that 
    //will run in response to actions defined outside of the slice. 
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                //upsertMany: accepts an array of entities or an object 
                //in the shape of Record<EntityId, T> that will be shallowly upserted.
                //will do a shallow copy to merge the old and new entities overwriting existing values, 
                //adding any that were not there and not touching properties not provided in the new entity.
                
                //When we receive the fetchPosts.fulfilled action, we can use the postsAdapter.upsertMany function 
                //to add all of the incoming posts to the state, by passing in the draft state 
                //and the array of posts in action.payload. If there's any items in action.payload that already existing in our state, 
                //the upsertMany function will merge them together based on matching IDs.
                postsAdapter.upsertMany(state, action.payload)
                /*
                state.posts = state.posts.concat(action.payload)
                */
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, postsAdapter.addOne)
            /*
            .addCase(addNewPost.fulfilled, (state, action) => {
                state.posts.push(action.payload)
            })
            */
    }

})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
export default postsSlice.reducer

//the inlined anonymous selectors we wrote directly inside of useSelector
/*
export const selectAllPosts = state => state.posts.posts
export const selectPostById = (state, postId) => 
    state.posts.posts.find(post => post.id === postId)
*/
//selectAll: maps over the state.ids array, and returns an array of entities in the same order.
//selectById: given the state and an entity ID, returns the entity with that ID or undefined.
//selectIds: returns the state.ids array.
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors(state => state.posts)

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
)

