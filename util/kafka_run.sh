kafka_dir="/opt/kafka"

function usage() {
   if [ ! -z "$1" ]; then
      echo "Error: $1"
   fi
   echo "Usage: `echo basename $0` start/stop [kafka_prefix]"
   exit 1
}

if [ -z "$1" ]; then
   usage
fi

if [ ! -z "$2" ]; then
   kafka_dir=$2
fi

if [ ! -d "${kafka_dir}" ]; then
   usage "kafka dir not found '${kafka_dir}'"
fi

cd ${kafka_dir}

case $1 in
   start)
      bin/zookeeper-server-start.sh config/zookeeper.properties 1>/dev/null &
      sleep 5
      echo "Press any key to start kafka server"
      read
      bin/kafka-server-start.sh config/server.properties &
      ;;

   stop)
      bin/kafka-server-stop.sh config/server.properties 1>/dev/null
      bin/zookeeper-server-stop.sh config/zookeeper.properties 1>/dev/null
      ;;

   *)
      usage
      ;;
esac
