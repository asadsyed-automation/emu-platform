import dns from 'dns';

const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);

resolver.resolveTxt('cluster0.sjjmybr.mongodb.net', (err, records) => {
  if (err) {
    console.error("❌ TXT Lookup Error:", err.message);
  } else {
    console.log("=== ATLAS TXT RECORD METADATA ===");
    console.log(records);
  }
});
