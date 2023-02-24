import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
//import { name } from "faker/lib/locales/az";
import { client } from '../../api/client'

const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = notificationsAdapter.getInitialState()

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotification',
    // see Redux part 6 -> Thunk Arguments
    async(_, { getState }) => {
        const allNotifications = selectAllNotifications(getState())
        const [ latestNotification ] = allNotifications
        //we want to use the creation timestamp of the most recent notification
        // as part of our request, 
        //so that the server knows it should only send back notifications that are actually new.
        const latestTimestamp = latestNotification ? latestNotification.date : ''
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        )
        return response.data
    }
)

const notificationsSlice = createSlice({
    name: 'notifications', 
    initialState,
    reducers: {
        allNotificationsRead(state, action) {
            Object.values(state.entities).forEach(notification => {
                notification.read = true
            })
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
            //getting back an array of notifications, so can pass state.push()
            //state.push(...action.payload)
            const notificationsWithMetadata = action.payload.map(notification => ({
                    ...notification,
                    read: false,
                    isNew: true,
            }))
            /*
            state.forEach(notification => {
                notification.isNew = !notification.read
            })
            state.sort((a,b) => b.date.localeCompare(a.date))
            */
           Object.values(state.entities).forEach(notification => {
            notification.isNew = !notification.read
           })
           notificationsAdapter.upsertMany(state, notificationsWithMetadata)
        })
    }
})

export const { allNotificationsRead } = notificationsSlice.actions
export default notificationsSlice.reducer

//export const selectAllNotifications = state => state.notifications
export const {
    selectAll: selectAllNotifications,
} = notificationsAdapter.getSelectors(state => state.notifications)