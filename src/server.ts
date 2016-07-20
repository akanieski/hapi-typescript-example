/// <reference path="../typings/index.d.ts" />

import {IPlugin} from "./libs/plugins/interfaces";
import Configurations from "./configs/configurations";
import Hapi = require('hapi');
import Routes from "./routes";
import fs = require('fs');
import path = require('path');

var port = process.env.port || Configurations.Server.port;
var server = new Hapi.Server();

server.connection({ port: port });

//  Setup Hapi Plugins
const pluginsPath = __dirname + '/libs/plugins/';
const plugins = fs.readdirSync(pluginsPath).filter(file => fs.statSync(path.join(pluginsPath, file)).isDirectory());

plugins.forEach((pluginName: string) => {
    var plugin: IPlugin = (require("./libs/plugins/" + pluginName)).default();
    console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
    plugin.register(server);
});

//Register Routes
Routes(server);

server.start(function() {
    console.log('Server running at:', server.info.uri);
});
