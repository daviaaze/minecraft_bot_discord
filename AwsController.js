const AWS = require('aws-sdk');
const Rcon = require('modern-rcon');
const rcon = new Rcon('minecraft.daviaaze.com', 25575,'cnt7275')
instance = { InstanceIds: ["i-0fb3b670f8e6e71cd"]};
Route53 = new AWS.Route53();
ec2 = new AWS.EC2();
module.exports = {
  status(message) {
    ec2.describeInstances(instance,(err,data) => {
      message.channel.send(`Server is: ${data.Reservations[0].Instances[0].State.Name}`);
    });
  },
  start(){
    ec2.startInstances(instance);
    setTimeout(() => {
      ec2.describeInstances(instance, function(err, data) {
        if (err) console.log('Error',err); // an error occurred
        else  var Ec2ip = data.Reservations[0].Instances[0].PublicIpAddress;           // successful response
        var params = {
        ChangeBatch: {
         Changes: [
            {
           Action: "UPSERT", 
           ResourceRecordSet: {
            Name: "minecraft.daviaaze.com", 
            ResourceRecords: [
               {
              Value: Ec2ip,
             }
            ], 
            TTL: 60, 
            Type: "A"
           }
          }
         ], 
         Comment: "Web server for daviaaze.com"
        }, 
        HostedZoneId: "Z3QY9THUTSHQWL"
        };
        Route53.changeResourceRecordSets(params, function(err, data){
         if(err) console.log(err, err.stack);
         else  console.log(data);
        });
      });
    }, 10000);
  },
  stop(){
    rcon.connect().then(() => {
      rcon.send('stop');
    }).then(() => {rcon.disconnect();
    setTimeout(ec2.stopInstances(instance, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);
     }), 2000);});
  },
}