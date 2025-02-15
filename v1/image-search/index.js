import weaviate from 'weaviate-ts-client'

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:808'
});

const schemeRes = await client.schema.getter().do()

// havent completed because docker images size for waevire vector db is 6.7GB