call kafka_conf.cmd

call %KFK_BIN%\zookeeper-server-start.bat %KFK%\config\zookeeper.properties
exit