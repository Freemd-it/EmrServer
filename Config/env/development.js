module.exports = {
    server: {
        trust_proxy_host: "127.0.0.1",
        port: 3000,
        session_expire: 12,
        single_cluster: false,
        data_read_time: 3600000,
        accept_domain: "http://127.0.0.1:3000",
        cookie_secret: "jL/Vh4m1ofhZTgwSaXCpnzly1dwzxH7QEGFHDlf89E4=",
        session_secret: "33+9+d5lMfQyQM4c0LoZtDcx4f8SDBAyiAnoKYVd1/k=",
        auth_key: "4a9dadf9e5919d66ec9701f9325721c9954ac88c" // freemed-emr-made-in-ppeeou&giseoplee&bttb66&DongyeolLee&donghyundonghyun
    },
    store: {
        storeDBMS: "mysql",
        mysqlHost: "52.78.111.151",
        mysqlPort: "3306",
        mysqlUser: "user",
        mysqlPassword: "test123$",
        mysqlDatabase: "freemed",
        ConnectionLimit: 100,
        ConnectionMinimum: 0,
        ConnectionIdle: 10000
    },
    redis: {
        redisHost: "52.78.111.151",
        redisPort: 6379,
        redisPassword: "test123$"
    },
    google: {
        google_client_id: "979047584146-72ng4egamv87mreke3d5ttmnpgosiiev.apps.googleusercontent.com",
        google_client_password: "5K8Sx_K29T2Vsofa_bxMkJwi"
    }

};
