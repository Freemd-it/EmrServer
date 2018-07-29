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
    redisConfig: {
        redisHost: "localhost",
        redisPort: 32769,
        redisPassword: ""
    },
    google: {
        google_client_id: "979047584146-72ng4egamv87mreke3d5ttmnpgosiiev.apps.googleusercontent.com",
        google_client_password: "5K8Sx_K29T2Vsofa_bxMkJwi"
    }

};