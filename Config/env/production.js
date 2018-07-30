module.exports = {
    server: {
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
    store: {
        storeDBMS: "mysql",
        mysqlHost: "freemed.cc6k6eitb2mt.ap-northeast-2.rds.amazonaws.com",
        mysqlPort: "3306",
        mysqlUser: "freemed",
        mysqlPassword: "sR{gf`qXd.c68h~G",
        mysqlDatabase: "freemed",
        ConnectionLimit: 100,
        ConnectionMinimum: 0,
        ConnectionIdle: 10000
    },
    redis: {
        redisHost: "localhost",
        redisPort: 32769,
    },
    google: {
        google_client_id: "868774816296-8gs47ji7d76ht5s10asp76il5nh0a2p1.apps.googleusercontent.com",
        google_client_password: "DVZNWCGUdzy4zsXCmh3I7I4V"
    }

};