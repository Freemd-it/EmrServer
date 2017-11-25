module.exports = {
    respondHtml
}

function respondHtml(res, tpl, obj, status) {
    res.render(tpl, obj);
}
