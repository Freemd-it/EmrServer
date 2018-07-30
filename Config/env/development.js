module.exports = {
    server: {
        trust_proxy_host: "127.0.0.1",
        port: 3000,
        cookie_expire: 6,
        cookie_max_age: 15000,
        single_cluster: false,
        data_read_time: 3600000,
        accept_domain: "http://127.0.0.1:3000",
        cookie_secret: "jL/Vh4m1ofhZTgwSaXCpnzly1dwzxH7QEGFHDlf89E4=",
        session_secret: "33+9+d5lMfQyQM4c0LoZtDcx4f8SDBAyiAnoKYVd1/k=",
        auth_key: "4a9dadf9e5919d66ec9701f9325721c9954ac88c" // freemed-emr-made-in-ppeeou&giseoplee&bttb66&DongyeolLee&donghyundonghyun
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
        redisPort: 32769
    },
    google: {
        google_client_id: "868774816296-mnucqd576pu004hmdc2fk9blv7oikkl3.apps.googleusercontent.com",
        google_client_password: "g4HCXAGLruPno6IXquFNcWko"
    }

};
