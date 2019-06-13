// example call
//
// 1) start a now dev server with 'now dev'
// 2) make a http call
// curl -s \
//   -d '{"name":"ralph"}' \
//   -H "Content-Type: application/json" \
//   -H "Accept: application/json" \
//   -X POST http://localhost:3000/api/route-test.js
module.exports = async (req, res) => {
  let body = []
  await req
    .on('data', chunk => {
      body.push(chunk)
    })
    .on('end', () => {
      body = Buffer.concat(body).toString()
      const json = JSON.parse(body)
      res.end(JSON.stringify({hello: json.name}, undefined, 4))
    })
}
