# Description
This is a small helper service to add a check to the github status for release branches.

### Example Github Status

![image](https://user-images.githubusercontent.com/172394/48440494-52c55500-e789-11e8-897b-61fdf7250ed6.png)

# How to use

### Local Development
```
# start the service locally
GH_TOKEN=<your token> npm run start
curl -d '{"repository":"livingdocs-editor","sha":"your-sha"}' -H "Content-Type: application/json" -X POST localhost:3000
```

### Call the Service via Command Line
```
curl -d '{"repository":"livingdocs-editor","sha":"your-sha"}' -H "Content-Type: application/json" -X POST https://gh-release-branch-status.now.sh
```


### Call the Service via Travis
```
curl -d "{\"repository\":\"livingdocs-editor\",\"sha\":\"$TRAVIS_COMMIT\"}" -H "Content-Type: application/json" -X POST https://gh-release-branch-status.now.sh
```
