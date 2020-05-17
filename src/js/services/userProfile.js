let user = null;
let avatar = '';
let searchUserData = [];

const UserProfileService = (function () {

    var getLoggedInUser = function() {
        if (user == null) {
            user = JSON.parse(localStorage.getItem('user'));
        }
        return user;
    };

    var setLoggedInUser = function(_user) {
        localStorage.setItem('userId', _user.id);
        localStorage.setItem('token', _user.UserLogin.auth_token);
        localStorage.setItem('user', JSON.stringify(_user));
        user = _user;
    };

    var logout = function() {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    var getAvatarURL = function() {
        user = localStorage.getItem('user');
        var avatarUrl = user.avatar_url;
        return avatarUrl;
    };

    return {
        getLoggedInUser: getLoggedInUser,
        setLoggedInUser: setLoggedInUser,
        logout: logout,
        getAvatarURL: getAvatarURL
    }
})();

export default UserProfileService;