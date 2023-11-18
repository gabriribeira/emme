import axios from "axios";

export default function sendNotificationToFCM(messageObject) {
    axios.post('https://fcm.googleapis.com/fcm/send',
        messageObject,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=AAAAbntANMk:APA91bHdFfZ4KP1pOCXdo6uwPrfYuJW0h493mrEUcxqUSaL4yVo2ls7EQ55T6pYOy-lLypJU4VRu5OViinQSHW8Zuk7z392oUM9UMSH3IgqXL97Vi3Upaggp3ADih6ha4OpFsP5avlaZ`
            }
        }).then((response) => {
            console.log('res -> ', response);
        }).catch((err) => console.log('error ->', err));
}