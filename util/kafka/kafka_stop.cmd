call kafka_conf.cmd

call %KFK_BIN%\kafka-server-stop.bat %KFK%\config\server.properties
timeout 4
call %KFK_BIN%\zookeeper-server-stop.bat %KFK%\config\zookeeper.properties
