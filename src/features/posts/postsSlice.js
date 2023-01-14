import { createSlice } from '@reduxjs/toolkit';

const initialState = [
    {id:'1', title: 'first post', content: 'hello'},
    {id:'2', title: 'secound post', content: 'more text'},
];

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded(state, action) {
            state.push(action.payload)
        }
    }
})

export const { postAdded } = postsSlice.actions
export default postsSlice.reducer