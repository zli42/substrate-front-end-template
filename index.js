const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');


const WEB_SOCKET = 'ws://localhost:9944';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const connectSubstrate = async () => {
  const wsProvider = new WsProvider(WEB_SOCKET);
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;
  console.log("connected to substrate")
  return api;
};

const subscribeAliceBalance = async (api) => {
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');
  await api.query.system.account(alice.address, aliceAcct => {
    console.log("subscribed to Alice");
    const aliceFreeSub = aliceAcct.data.free;
    console.log(`Alice's account: ${aliceFreeSub}`);
  });
};

const main = async () => {
  const api = await connectSubstrate();

  await subscribeAliceBalance(api);
  await sleep(600000);

  console.log('game over');

};

main()
  .then(() => {
    console.log("successfully exited");
    process.exit(0);
  })
  .catch(err => {
    console.log('error occur:', err);
    process.exit(1);
  })