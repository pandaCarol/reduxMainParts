import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons";
import { selectAllPosts, fetchPosts, selectPostIds, selectPostById } from "./postsSlice";
import { Spinner } from '../../components/Spinner'

let PostExcerpt = ({ postId }) => {
    console.log('run PostExcerpt')
    const post = useSelector(state => selectPostById(state, postId))
    return (
        <article className="post-excerpt" key={post.id}>
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
//PostExcerpt = React.memo(PostExcerpt)

export const PostList = () => {
    const dispatch = useDispatch()
    const orderedPostIds = useSelector(selectPostIds)

    //omit component contents
    //const posts = useSelector(selectAllPosts);
    console.dir(selectPostIds);
    console.dir(orderedPostIds);

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
        content = orderedPostIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ))

        //replace for createEntityAdapter
        /*
        const orderedPosts = posts
            .slice()
            .sort((a,b) => b.date.localeCompare(a.date))

        content = orderedPosts.map(post => (
            <PostExcerpt key={post.id} post={post} />
        ))
        */
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    console.log(content);
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