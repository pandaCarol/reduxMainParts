import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons";

export const PostList = () => {
    const posts = useSelector(state => state.posts);
    //console.dir(posts);

    const orderPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))
    const rederedPosts = orderPosts.map(post => {
        return (
            <article className="post-excerpt" key={post.id}>
                <h3>{post.title}</h3>
                <div>
                    <PostAuthor userId={post.user}/>
                    <TimeAgo timestamp={post.date}/>
                </div>
                <p className="post-content">{post.content.substring(0, 100)}</p>
                <ReactionButtons post={post}></ReactionButtons>
                <Link to={`/posts/${post.id}`} className="button muted-button"> 
                    View Post
                </Link>
            </article>
        )
    })

    //The localeCompare() method returns a number indicating 
    //whether a reference string comes before, or after, 
    //or is the same as the given string in sort order.
    

    return(
        <section className="post-list">
            <h2>Posts</h2>
            {rederedPosts}
        </section>
    )
}