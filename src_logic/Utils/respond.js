

const respondHtml = (res, tpl, obj, status) => {
    res.render(tpl, obj);
}

const respondJson = (res, code, obj, status) => {

    if (status) {
        res
            .status(status)
            .json({
                code: code,
                data: obj
            })
    } else { 
        res.json({
            code: code,
            data: obj
        })
    }
}

const respondOnError = (res, code, obj, status) => {
    if (status) {
        res
            .status(status)
            .json({
                code: code,
                data: obj
            })
    } else {
        res.json({
            code: code,
            data: obj
        })
    }
}

module.exports = {
    respondHtml,
    respondJson,
    respondOnError
}
