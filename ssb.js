const ssbClient = require('ssb-client')
const ssbKeys = require('ssb-keys')


// configuration:
const keys = ssbKeys.loadOrCreateSync('/home/giga/.ssb/secret')


const conn = ()=> new Promise((res, rej) => {
    ssbClient(
      keys,                // optional, defaults to ~/.ssb/secret
      {
        host: 'localhost', // optional, defaults to localhost
        port: 8008,        // optional, defaults to 8008
        key: keys.id,      // optional, defaults to keys.id

        caps: {
            // random string for `appKey` in secret-handshake
            shs: 'GIgAOmiUF/zDNKV3/i1FZGPzs1AnB115IjBsx0BFsr0='
        }
      },
      function (err, sbot, config) {
          if (err)  rej(err); 
          res(sbot);
      }
    )
});

const publish = (sbot, message) => {
    return new Promise((res, rej) => {
        sbot.publish(message, (err, end) => {
            if (err) rej(err)
            sbot.close();
            res(end);
        })
    })
    
}

const mock_post = {
    type: "post",
    text: "hello2"
}

const run = async(post) => {
    const sbot = await conn();
    const result = await(publish(sbot, post));
    return result;
}

module.exports = run;


