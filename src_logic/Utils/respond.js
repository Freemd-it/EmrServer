module.exports = {
    respondHtml,
    respondJson
}


function respondHtml(res, tpl, obj, status) {
    res.render(tpl, obj);
}

function respondJson(res, code, obj, status) {

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
  