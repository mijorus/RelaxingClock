// import axios, { AxiosInstance } from "axios";

// export var playbackStarted = false;

// // *** Ajax **
// var requestHeader    = undefined;
// const spotifyBaseURL = 'https://api.spotify.com/v1'

// export class SpotofyClient {
//     access_token: string;
//     client: AxiosInstance;

//     constructor(access_token) {
//         this.access_token = access_token;
//         this.client = axios.create({ headers: { 'Authorization': `Bearer ${this.access_token}` }});
//     }


//     findDevices() {
//         return axios({
//             method: 'GET',
//             url: spotifyBaseURL + '/me/player/devices',
//             headers: requestHeader,
//         })
//     }

//     getUserDetails() {
//             return axios({
//                 type: "GET",
//                 url: spotifyBaseURL + '/me', 
//             })
//                 .fail(function(error) {
//                     spotifyError.logError('CANNOT GET YOUR USERNAME:', error, true);
//                     updateStatusText(`Cannot get your your profile infos :(`);
//                 })
//     }

//     getPlaylistList(externalUser = undefined, limit = 50, offset = 0) {
//         return axios({
//             type: "GET",
//             headers: requestHeader,
//             url: spotifyBaseURL + ( (externalUser) ? `/users/${externalUser}` : '/me' ) + '/playlists',
//             data: {
//                 limit: limit,
//                 offset: offset,
//             }
//         })
//             .fail(function (error) {
//                 spotifyError.logError('CANNOT GET YOUR PLAYLIST LIST:', error, false);
//             })
//     }

//     getShowList(limit = 50, offset = 0) {
//         return axios({
//             type: "GET",
//             headers: requestHeader,
//             url: spotifyBaseURL + '/me/shows',
//             data: {
//                 limit: limit,
//                 offset: offset,
//             }
//         })
//             .fail(function (error) {
//                 spotifyError.logError('CANNOT GET YOUR PODCAST LIST:', error, false);
//             })
//     }

//     getShowEpisodes(id, limit = 50, offset = 0) {
//         return axios({
//             type: "GET",
//             headers: requestHeader,
//             url: spotifyBaseURL + '/shows/' + id + '/episodes',
//             data: {
//                 limit: limit,
//                 offset: offset,
//             }
//         })
//             .fail(function (error) {
//                 spotifyError.logError('CANNOT GET THE SELECTED PODCAST:', error, false);
//             })
//     }

//     getPlaylistData(playlistURL) {
//         return axios({
//             type: "GET",
//             url: spotifyBaseURL + `/playlists/${playlistURL}`,
//             headers: requestHeader
//         })
//             .fail(function(error) {
//                 spotifyError.logError('CANNOT GET PLAYLIST DATA:', error, false);
//             });
//     }

//     play(device_id, params = {}) {
//         return axios({
//             type: "PUT",
//             headers: requestHeader,
//             url: spotifyBaseURL + '/me/player/play?device_id=' + device_id,
//             data: JSON.stringify(params)
//         })
//             .done(function() {
//                 console.log(`I am playing on: [Device id:${device_id}]`);
//                 playbackStarted = true;
//                 $(playbackIcon).removeClass('fa-play').addClass('fa-pause');
//             })
//             .fail(function(error) {
//                 spotifyError.logError('PLAYBACK ERROR!', error);
//                 switch (error.status) {
//                     case 500 || 502 || 503:
//                         $(spotifyPlaceholder).text('Server Error :(');
//                     break;

//                     case 401:
//                         if (error.responseJSON.error.message === 'The access token expired') {
//                             spotify.refreshToken()
//                                 .then(() => {
//                                     spotify.play();
//                                 })
//                         }
//                     break;
                
//                     case 403:
//                         if (error.reason === 'PREMIUM_REQUIRED') {
//                             spotifyError.throwPremiumError();
//                         } else {
//                             spotifyError.logError('Login error: ', error.reason || '', true);
//                         }
//                     break;

//                     default:
//                         spotifyError.logError('Login error: ', error.reason || '', true);
//                     break;
//                 }
//             })
//     }

//     shuffle(state) {
//         axios({
//             type: "PUT",
//             headers: requestHeader,
//             url: spotifyBaseURL + `/me/player/shuffle?state=${state}&device_id=${deviceID}`,
//         })
//             .done(function() {
//                 console.log('SHUFFLE IS ENABLED!');
//             })
//             .fail(function(error) {
//                 spotifyError.logError('ERROR WHILE ENABLING SHUFFLE MODE:', error, false);
//             })
//     }

//     search(query = ' ', types, limit = 7) {
//         return axios({
//             type: "GET",
//             headers: requestHeader,
//             url: spotifyBaseURL + `/search`,
//             data: {
//                 q: query,
//                 type: types,
//                 limit: limit,
//             }
//         })
//             .fail(function(error) {
//                 spotifyError.logError('ERROR WHILE SEARCHING SPOTIFY DATABASE:', error, false);
//             })
//     }

//     // The changeState parameter specifies if we have 
//     // to display only the changes on screen or we also 
//     // need to add the current song to the library
//     isLiked(song, changeState) {
//         axios({
//             type: "GET",
//             headers: requestHeader,
//             url: spotifyBaseURL + `/me/tracks/contains?ids=${song}`,
//         })
//             .done(function(response) {
//                 if (response[0]) {
//                     console.log('This song is in your library');
//                     (changeState) 
//                         ? likeSong(song, false) 
//                         : handleHeartButton(true);
//                 } else {
//                     console.log('This song is NOT in your library');
//                     (changeState) 
//                         ? likeSong(song, true) 
//                         : handleHeartButton(false);
//                 }
//             })
//             .fail(function(error) {
//                 spotifyError.logError('CANNOT CHECK IF THIS SONG IS ALREADY IN YOUR LIBRARY:', error)
//             })
//     }

//     likeSong(song, toLike = true) {
//         axios({
//             type: (toLike) ? "PUT" : "DELETE", 
//             headers: requestHeader,
//             url: spotifyBaseURL + `/me/tracks?ids=${song}`,
//         })
//             .done(function () {
//                 if (toLike) {
//                     console.log('ADDED TO FAV!');
//                     handleHeartButton(true);
//                 } else {
//                     console.log('REMOVED FROM FAV!');
//                     handleHeartButton(false);
//                 }
//             })
//             .fail(function (error) {
//                 (toLike)
//                     ? spotifyError.logError('CANNOT ADD TO FAV:', error, false)
//                     : spotifyError.logError('CANNOT REMOVE FROM FAV:', error, false);
//             })
//     }
// }

