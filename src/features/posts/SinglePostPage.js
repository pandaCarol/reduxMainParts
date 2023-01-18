import React from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

export const SinglePostPage = ({match}) => {
    //console.log(match);
    const { postId } = match.params;

    const post = useSelector(state => 
        //.find returns the first element in the provided array 
        //that satisfies the provided testing function. 
        //If no values satisfy the testing function, undefined is returned.
        state.posts.find(post => post.id === postId)
    )
    //console.log(post);

    if(!post) {
        return(
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <section>
            <article className="post">
                <h2>{post.title}</h2>
                <p className="post-content">{post.content}</p>
                <Link to={`/editPost/${post.id}`} className='button'>
                    Edit Post
                </Link>
            </article>
        </section>
    )
}