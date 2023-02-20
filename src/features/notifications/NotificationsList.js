
import React, { useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";
import classNames from "classnames";

import { selectAllUsers } from "../users/usersSlice";
import { selectAllNotifications, allNotificationsRead } from "./notificationsSlice";

export const NotificationsList = () => {
    const dispatch = useDispatch()
    const notifications = useSelector(selectAllNotifications)
    const users = useSelector(selectAllUsers)

    //useLayoutEffect is a version of useEffect that fires 
    //before the browser repaints the screen.
    useLayoutEffect(() => {
        dispatch(allNotificationsRead())
    })

    const renderedNotification = notifications.map(notification => {
        //Creates a Date object representing a specified time in ISO format.
        //parseISO (str: string) -> Date (return the data object) 
        const date = parseISO(notification.date)
        const timeAgo = formatDistanceToNow(date)
        const user = users.find(user => user.id === notification.user) || {
            name: 'Unknown User'
        }
        
        //joining classNames together.
        const notificationClassname = classNames('notification', {
            new: notification.isNew
        })

        return (
            <div key={notification.id} className={notificationClassname}>
                <div>
                    <b>{user.name}</b> {notification.message}
                </div>
                <div title={notification.date}>
                    <i>{timeAgo} ago</i>
                </div>
            </div>
        )
    })

    return (
        <section className="notificationsList">
            <h2>Notification</h2>
            
            {renderedNotification}
        </section>
    )

}