const Config = {
    env: 'local',
    local: {
        url: 'http://localhost:3006',
        RESTURL: 'https://api.xwards.com'
    },
    dev: {
        url: 'https://dev.dashboard.xwards.com',
        RESTURL: 'https://dev.api.xwards.com'
    },
    test: {
        url: 'https://test.dashboard.xwards.com',
        RESTURL: 'https://test.api.xwards.com'
    },
    prod: {
        url: 'https://dashboard.xwards.com',
        RESTURL: 'https://api.xwards.com'
    }
}

export default Config;