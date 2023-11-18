import React from "react";
import axios from "axios";

export default function createNotificationGroup(userId) {
    
    axios.post('https://fcm.googleapis.com/fcm/notification', {
        "operation": "create",
        "notification_key_name": "GabrielFollowers",
        "registration_ids": ["dVqy7jtF-k2d-2SFUd5w9y:APA91bFVk-9b55rrVALv3mOpa2e67de1mGOln32ZqW-qDt-8S8oFxM_MjlqaixQtNFWoUwmbuP8WLxEI5EoInZ4OtnrhHRaoiQCfpokCRBGSOqdMfuxE_Jbb0TOxjR4ZVuGkjnKge49F"]
    }, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': "key=AAAAbntANMk:APA91bHdFfZ4KP1pOCXdo6uwPrfYuJW0h493mrEUcxqUSaL4yVo2ls7EQ55T6pYOy-lLypJU4VRu5OViinQSHW8Zuk7z392oUM9UMSH3IgqXL97Vi3Upaggp3ADih6ha4OpFsP5avlaZ",
            "project_id": "474514207945",
        }
    })
        .then((response) => {
            console.log('res -> ', response);
        }).catch((err) => console.log('error ->', err));

}