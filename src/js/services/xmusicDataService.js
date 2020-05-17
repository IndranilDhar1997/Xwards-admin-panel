const XmusicDataService = {

    saveXMusicData: (xmusicData) => {
        localStorage.setItem('xmusicData', JSON.stringify(xmusicData));
    },

    getXMusicData: () => {
        var xmusicData = JSON.parse(localStorage.getItem('xmusicData'));
        return xmusicData;
    },

    removeXMusicData: () => {
        localStorage.removeItem('xmusicData');
    }

};

export default XmusicDataService;