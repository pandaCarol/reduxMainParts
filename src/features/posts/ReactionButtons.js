import React from 'react'
import { useDispatch } from 'react-redux'

import { reactionAdded } from './postsSlice'

const reactionEmoji = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀'
}

export const ReactionButtons = ({ post }) => {
    const dispatch = useDispatch()

    //The entries() method returns a new Array Iterator object 
    //that contains the key/value pairs for each index in the array.
    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button 
                key={name} 
                type='button' 
                className='muted-button raction-button'
                onClick={() => 
                    dispatch(reactionAdded({postId: post.id, reaction: name}))
                }
            >
                
                {emoji} {post.reactions[name]}
            </button>
        )
    })

    return <div>{reactionButtons}</div>
}

