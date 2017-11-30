module.exports = {
    server: {
        trust_proxy_host: "127.0.0.1",
        port: 3000,
        session_expire: 1080000,
        single_cluster: false,
        data_read_time: 3600000,
        accept_domain: "http://127.0.0.1:3000",
        cookie_secret: "jL/Vh4m1ofhZTgwSaXCpnzly1dwzxH7QEGFHDlf89E4=",
        session_secret: "33+9+d5lMfQyQM4c0LoZtDcx4f8SDBAyiAnoKYVd1/k=",
        auth_key: "fcde0a4282228940975e694e32f74be002cf3d8fb3889d69514a039b1f72950a97f3c7fc80a707548c59d8506fb5286d8d45b3a9cda01a19436259bc8956428c"
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
        redisHost: "redis",
        redisPort: 6379,
        redisPassword: ""
    },
    google: {
        google_client_id: "132166996823-gb903hunh1l6mpgn7q5eqtnk29q9if5d.apps.googleusercontent.com",
        google_client_password: "GN6YIasE1d0daJFggB-VhDAj"
    }

};
