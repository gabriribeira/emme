import React from 'react';

const Authorization = () => {

    var client_id = 'e8c923fc7ef643ceb3b608a28c4c784e';
    var client_secret = 'd84bf5a6f59d4fa9a97b320bc0a07fcc';

    var client = window.btoa(client_id + ":" + client_secret);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic " + client);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
    };

    const Auth = async () => {

        try {

            await fetch('https://accounts.spotify.com/api/token?', requestOptions)
                .then(response => response.json())
                .then(data => { 
                    localStorage.removeItem("token");
                    localStorage.setItem(data.token_type, data.access_token);
                });

        } catch (error) {

            console.log("error", error);

        }

    }

    Auth();

}

export default Authorization;