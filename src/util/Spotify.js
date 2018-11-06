let accessToken = null;

const clientID =  'ebea4c0e5e584569a59af51fc0de20aa';
const redirectURI = 'http://localhost:3000/';

const Spotify = {

    getAccessToken: () => {

        if (accessToken) {
            return accessToken;
        } 

        // check for access token in current url.
        let url = window.location.href;
        let token = null;
        let expiresIn = null;
        let tokenMatch = url.match(/access_token=([^&]*)/);
        if (tokenMatch) {
            token = tokenMatch[0].split("=")[1];
        }
        let expireMatch = url.match(/expires_in=([^&]*)/);
        if (expireMatch) {
            expiresIn = expireMatch[0].split("=")[1];
        }
        if (token && expiresIn) {
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            accessToken = token;
        }

        // if token not in url then redirect to spotify for new token.

        if (!accessToken || accessToken.length === 0) {
            const getTokenURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = getTokenURL;
        } else {
            return accessToken;
        }
    },

    search: async (searchTerm) => {

        const fetchURL = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;

        const accessToken = Spotify.getAccessToken();
        let header = {
            headers: {Authorization: `Bearer ${accessToken}`}
        };

        try {
            const response = await fetch(fetchURL, header);

            if (response.ok) {
                const jsonResponse = await response.json();

                if (jsonResponse.tracks.items) {
                    return jsonResponse.tracks.items.map(track => {
                        return {
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri
                        };
                    });
                } else {
                    return [];
                }
            }
            throw new Error('Request failed!');
        } catch (error)  {
            console.log(error)
        }
    },

    savePlaylist: async (playListName, trackURIs) => {

        if ( !playListName || playListName.length === 0 ||
             !trackURIs || trackURIs.length === 0) {
            return;
        }

        try {

            const accessToken = Spotify.getAccessToken();
            const header = {
                headers: {Authorization: `Bearer ${accessToken}`}
            };

            // Get User Id.

            let userId;
            const fetchUserIdURL = 'https://api.spotify.com/v1/me';

            let response = await fetch(fetchUserIdURL, header);

            if (response.ok) {
                const jsonResponse = await response.json();
                userId = jsonResponse.id;
                
            } else {
                throw new Error('Get User Id Request failed!');
            }

            // Create Playlist space.

            let playlistId; 
            const createPlaylistURL =  `https://api.spotify.com/v1/users/${userId}/playlists`;
            const data = JSON.stringify({name: playListName});

            response = await fetch(createPlaylistURL,             
                        { method: 'POST',
                          body: data,
                          headers: { 
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${accessToken}` 
                           }
                        });
                        
            if (response.ok) {
                const jsonResponse = await response.json();
                playlistId = jsonResponse.id

            } else {
                throw new Error('Create Playlist space Request failed!');
            }

            // Add tracks to playlist.
            
            const addTrackToPlaylistURL =  `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
            const trackData = JSON.stringify({uris: trackURIs});

            response = await fetch(addTrackToPlaylistURL,             
                { method: 'POST',
                  body: trackData,
                  headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}` 
                   }
                });

            if (!response.ok) {
                throw new Error('Add tracks to playlist Request failed!');
            }

        } catch (error)  {
            console.log(error);
        }

    }
};

export default Spotify;