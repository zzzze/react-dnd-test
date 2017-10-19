var express = require('express');
var app = express();

app.use(express.static('dist'));

//单页应用
app.get("*", function (request, response) {
    response.sendFile(__dirname + "/dist/" + "index.html");
});

app.listen(8080, function () {
    process.send && process.send('express ready');
});