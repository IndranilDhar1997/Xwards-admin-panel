import Config from '../../config';

export default {

    //LOGIN
    Login: function () {
        return Config[Config.env].RESTURL + "/admin/login";
    },

    Logout: function() {
        return Config[Config.env].RESTURL + "/admin/logout";
    },

    SearchVehicle: function(key) {
        return Config[Config.env].RESTURL + "/admin/search-vehicles/" + key;
    },

    GetSearchedVehicle: function(driverId) {
        return Config[Config.env].RESTURL + "/admin/vehicle/" + driverId;
    },

    Get_Critical_Drivers: function() {
        return Config[Config.env].RESTURL + "/admin/critical-drivers";
    },

    GET_CONTENTS_TO_APPROVE: function() {
        return Config[Config.env].RESTURL + "/admin/contents/";
    },
    GET_CONTENT_FOR_PREVIEW: function(contentID, userId) {
        return Config[Config.env].RESTURL + "/admin/contents/"+contentID+"/?user="+userId;
    },
    SAVE_CONTENT_TO_LIVE: function(contentID) {
        return Config[Config.env].RESTURL + "/admin/contents/"+contentID;
    },
    REJECT_CONTENT: function(contentID) {
        return Config[Config.env].RESTURL + "/admin/contents/"+contentID+"/reject";
    },

    //XPLAY ROUTES

    GET_XPLAY_REQUESTS: function() {
        return Config[Config.env].RESTURL + "/admin/xplay-requests"; //All Xplay Requests
    },

    ACCEPT_XPLAY_REQUEST: function() {
        return Config[Config.env].RESTURL + "/admin/approve-request"; //Approve Xplay Requests
    },

    DELETE_XPLAY_REQUEST: function(requestId) {
        return Config[Config.env].RESTURL + "/admin/reject-request/" + requestId; //Reject Xplay Requests
    },

    GET_XPLAY_VIDEOS: function() {
        return Config[Config.env].RESTURL + "/admin/videos"; //All Xplay Videos
    },

    GET_XPLAY_VIDEO_BY_ID: function(videoId) {
        return Config[Config.env].RESTURL + "/admin/videos/" + videoId; //All Xplay Video By Id
    },

    REJECT_XPLAY_VIDEO: function(videoId) {
        return Config[Config.env].RESTURL + "/admin/videos/" + videoId + "/reject"; //Reject Xplay Video
    },

    SAVE_XPLAY_VIDEO_TO_LIVE: function(videoId) {
        return Config[Config.env].RESTURL + "/admin/videos/" + videoId; //Approve Xplay Video
    },

    //XMUSIC Routes

    GET_XMUSIC_REQUESTS: function() {
        return Config[Config.env].RESTURL + "/admin/xmusic-requests"; //All XMusic Requests
    },

    ACCEPT_XMUSIC_REQUEST: function() {
        return Config[Config.env].RESTURL + "/admin/approve-xmusic-request"; //Approve XMusic Requests
    },

    DELETE_XMUSIC_REQUEST: function(requestId) {
        return Config[Config.env].RESTURL + "/admin/reject-xmusic-request/" + requestId; //Reject XMusic Requests
    },

    GET_XMUSIC_AUDIOS: function() {
        return Config[Config.env].RESTURL + "/admin/music"; // Get UnApproved Musics
    },

    GET_XMUSIC_AUDIO_BY_ID: function(musicId) {
        return Config[Config.env].RESTURL + "/admin/music/" + musicId; // Get UnApproved Music by Id
    },

    REJECT_XMUSIC_AUDIO: function(musicId) {
        return Config[Config.env].RESTURL + "/admin/music/" + musicId + "/reject" // Reject the video
    },

    SAVE_XMUSIC_AUDIO_TO_LIVE: function(musicId) {
        return Config[Config.env].RESTURL + "/admin/music/" + musicId  // Accept the video
    }
    
}