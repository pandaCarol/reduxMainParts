import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons";
import { selectAllPosts, fetchPosts } from "./postsSlice";
import { Spinner } from '../../components/Spinner'

const PostExcerpt = ({ post }) => {
    return (
        <article className="post-excerpt">
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date}/>
            </div>
            <p className="post-content">{post.content.substring(0,100)}</p>
            <ReactionButtons post={post}/>
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )
}

export const PostList = () => {
    const dispatch = useDispatch()

    //omit component contents
    const posts = useSelector(selectAllPosts);
    //console.dir(posts);

    const postStatus = useSelector(state => state.posts.status)
    const error = useSelector(state => state.posts.error)

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    let content 
    if (postStatus === 'loading') {
        content = <Spinner text="Loading..." />
    } else if (postStatus === 'succeeded') {
        const orderedPosts = posts
            .slice()
            .sort((a,b) => b.date.localeCompare(a.date))
        
        content = orderedPosts.map(post => (
            <PostExcerpt key={post.id} post={post} />
        ))
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    /*
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
    */

    //The localeCompare() method returns a number indicating 
    //whether a reference string comes before, or after, 
    //or is the same as the given string in sort order.
    

    return(
        <section className="post-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}