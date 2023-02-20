import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client'
import { sub } from 'date-fns';

//create a middleware and thunk function
//**postSlice store look like {posts, status, error}
const initialState = {
    posts: [],
    status: 'idle', 
    error: null
}

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
    console.log('fetch run')
    console.log(response.data)
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async initialPost => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
                const { postId, reaction } = action.payload
                const existingPost = state.posts.find(post => post.id === postId)
                //const existingPost = selectPostById(state, postId)
                /*
                const existingPost = state.find(post => post.id === postId)
                */
                if(existingPost) {
                    existingPost.reactions[reaction]++
                }
            },

        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
                
                //without middleware, thunk
                /*
                state.push(action.payload)
                */
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
        /*
        postAdded(state, action) {
            state.push(action.payload)
        },
        */

        postUpdated(state, action) {
            const { id, title, content } = action.payload;
            const existingPost = state.posts.find(post => post.id === id)
            
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
                state.posts = state.posts.concat(action.payload)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                state.posts.push(action.payload)
            })
    }

})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
export default postsSlice.reducer

//the inlined anonymous selectors we wrote directly inside of useSelector
export const selectAllPosts = state => state.posts.posts
export const selectPostById = (state, postId) => 
    state.posts.posts.find(post => post.id === postId)

