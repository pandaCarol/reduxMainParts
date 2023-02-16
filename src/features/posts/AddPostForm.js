import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { nanoid } from "@reduxjs/toolkit";
import { addNewPost } from "./postsSlice";
//import { postAdded } from "./postsSlice";

export const AddPostForm = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const dispatch = useDispatch()
    const users = useSelector(state => state.users)
    //console.log(users)

    const onTitleChanged = e => setTitle(pro => e.target.value)
    const onContentChanged  = e => setContent(pro => e.target.value)
    const onAutherChanged = e => setUserId(pro => e.target.value)
    
    const canSave = 
        [title, content, userId].every(Boolean) && addRequestStatus === 'idle'
    //const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                //The unwrap() method removes the parent element of the selected elements.
                await dispatch(addNewPost({ title, content, user: userId })).unwrap()
                setTitle('')
                setContent('')
                setUserId('')
            } catch (err) {
                console.log('Failed to save the post', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }
    //without middleware and thunk
    /*
    const onSavePostClicked = () => {
        if (title && content) {
            dispatch(postAdded(title, content, userId))
            setTitle('')
            setContent('')
        }
    }
    */


    const userOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return(
        <section>
            <h2>Add a New Posts</h2>
            <form>
                <label htmlFor="postTitle">Post: Title</label>
                <input 
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAutherChanged}>
                    <option value=""></option>
                    {userOptions}
                </select>
                <label htmlFor="postContent">Content: </label>
                <textarea 
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="button" onClick={onSavePostClicked} disabled={!{canSave}}>
                    Save Post
                </button>
            </form>
        </section>
    )
}