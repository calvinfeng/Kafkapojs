# Kafkapojs

## Get Started with Kafka
I will jump straight into Kafka assuming that you have `node` installed and your `npm` is properly running.

## Kafka 0.11.x
### Mac OS X
#### Installation
Get the latest version of Java on your computer with
```
brew update
brew cask install java
```

And then try
```
brew install kafka
```

There is a good chance that it will complain about `JavaRequirement unsatisfied!`. Kafka is asking for Java 8 but Homebrew
gave you Java 9.

Try this
```
brew cask install caskroom/versions/java8
```

And then try installing Kafka again.

#### Run the service
If you wish to run it as a background service, use
```
brew services start zookeeper
brew services start kafka
```

However, I don't recommend it because you want to be able to configure your zookeeper and broker properties. So use this
**Zookeeper**
```
zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties
```
**Broker 0**
```
kafka-server-start /usr/local/etc/kafka/server-0.properties
```
**Broker 1**
```
kafka-server-start /usr/local/etc/kafka/server-1.properties
```
**Broker 2**
```
kafka-server-start /usr/local/etc/kafka/server-2.properties
```

### Ubuntu
#### Installation
Get Java but there is a good chance that `default-jre` and `default-jdk` on apt are out-dated.

Check if you have Java already installed.
```
java -version # Expected output => The program java can be found in the following packages...
```

If Java is not found then install it:
```
$ sudo apt-get update
$ sudo apt-get install default-jre
$ sudo apt-get install default-jdk
```
If the above installation step gives you Java 8+, then you are good to go, if not then you will need Webup8 apt repository for installing the latest Java.
```
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get install openjdk-8-jdk
```
Go to https://kafka.apache.org/downloads and download the latest version of Kafka which should be 0.11.x. *Remember to download
the binary not the source*.

And then extract the `tar` or `zip` into anywhere you like
```
cd ~/Downloads
tar -xzf kafka_<version>.tgz -C <your_choice_of_path>
```

#### Run the service
I am assuming that you have configured all the properties files and set replication factor to 3. I renamed my Kafka folder
to `kafka` for simplicity. I put it into a src folder for my project.

**Zookeeper**
```
./src/kafka/bin/zookeeper-server-start.sh ./src/kafka/config/zookeeper.properties
```

**Broker 0**
```
./src/kafka/bin/kafka-server-start.sh ./src/kafka/config/server-0.properties
```

**Broker 1**
```
./src/kafka/bin/kafka-server-start.sh ./src/kafka/config/server-1.properties
```

**Broker 2**
```
./src/kafka/bin/kafka-server-start.sh ./src/kafka/config/server-2.properties
```

## Configuration
A Kafka server is also known as a broker. Whenever we start running a broker, it requires a properties file which specify
the configurations for the broker. Most of the default settings should be fine for our use case. Further tweaking will be
needed as we develop our platform. By default, replication factor is 1, so we need to set it to 3 if we were to run
3 brokers.

### Brokers
Example for Broker 0:
```
broker.id=0
num.network.threads=3
num.io.threads=8
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400
socket.request.max.bytes=104857600
log.dirs=/tmp/kafka-logs
num.partitions=4
default.replication.factor=3
num.recovery.threads.per.data.dir=1
auto.create.topics.enable=true
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=1
log.retention.hours=168
log.segment.bytes=1073741824
log.retention.check.interval.ms=300000
zookeeper.connect=localhost:2181
zookeeper.connection.timeout.ms=6000
group.initial.rebalance.delay.ms=0
listeners=PLAINTEXT://localhost:9092
```                                        

If you want to start multiple brokers, make sure to create multiple proeprties file and change the listeners to different
port number for different server. *Don't forget to change the broker.id too!*

For example:
```
listeners=PLAINTEXT://localhost:9092
listeners=PLAINTEXT://localhost:9093
listeners=PLAINTEXT://localhost:9094
```

### Zookeeper
No need to change anything, just leave it as it is
```
dataDir=/tmp/zookeeper
clientPort=2181
maxClientCnxns=0
```
