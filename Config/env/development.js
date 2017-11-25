module.exports = {
    serverConfig: {
        trust_proxy_host: "",
        port: 3000,
        session_expire: 1080000,
        single_cluster: false,
        data_read_time: 3600000,
        accept_domain: "http://127.0.0.1:3000",
        cookie_secret: "",
        session_secret: "",
        auth_key: ""
    },
    storeConfig: {
        storeDBMS: "",
        mysqlHost: "",
        mysqlPort: "",
        mysqlUser: "user",
        mysqlPassword: "",
        mysqlDatabase: "",
        ConnectionLimit: 100,
        ConnectionMinimum: 0,
        ConnectionIdle: 10000
    },
    redisConfig: {
        redisHost: "redis",
        redisPort: 6379,
        redisPassword: ""
    },
    googleConfig: {
        google_client_id: "",
        google_client_password: ""
    }

};