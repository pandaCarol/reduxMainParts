import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersSlice";
import { selectPostsByUser } from '../posts/postsSlice'
import { Link } from "react-router-dom";

export const UserPage = ({ match }) => {
    const { userId } = match.params 
    
    const user = useSelector(state => selectUserById(state, userId))
    
    //Investigating Render Behavior
    //Component had rerendered, even it didn't read any notification
    /*
    const postsForUser = useSelector(state => {
        const allPosts = selectAllPosts(state)
        return allPosts.filter(post => post.user === userId)
    })
    */
    const postsForUser = useSelector(state => selectPostsByUser(state, userId))

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li> 
    ))

    return (
        <section>
            <h2>{user.name}</h2>

            <ul>{postTitles}</ul>
        </section>
    )

}