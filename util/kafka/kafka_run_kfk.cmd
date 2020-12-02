call kafka_conf.cmd

call %KFK_BIN%\kafka-server-start.bat %KFK%\config\server.properties
exit