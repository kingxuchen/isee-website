const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const fs = require("fs");
const Eco = require("./Ecosystem.js").Ecosystem;
const body = renderToStaticMarkup(React.createElement(Eco));
fs.writeFileSync("/tmp/wb-preview/body.html", body);
console.log("ok");
