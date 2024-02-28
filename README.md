# Description
This is a small helper service to add a check to the github status for release branches.

### Example Github Status

![image](https://user-images.githubusercontent.com/172394/48440494-52c55500-e789-11e8-897b-61fdf7250ed6.png)

# How to use

### Add Semantic Release Check on Github

![image](https://github.com/livingdocsIO/livingdocs-server/assets/172394/367ce840-8ad9-4480-8e0b-c0b98e0d5194)

1) Add script to drone.yml (usually in the linting step). Attention: If there is a common trigger like `trigger: event: [push]`, the script will not be executed.

```yaml
steps:
- ...

  # update semantic release status on github
- name: verify-commit-messages
  image: livingdocs/node:20
  when: {event: [pull_request]}
  commands:
    - |
      echo $(curl -s -d "{\"repository\":\"livingdocs-20min\",\"sha\":\"$DRONE_COMMIT_SHA\"}" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -X POST https://gh-release-branch-status.vercel.app)
```

2) Add your repository into `allowed_repositories.js`
3) Open a PR on Github (e.g. to the main branch)
4) Start local development and call the service locally (see below)
5) Go to the Github Settings and add the status check "Semantic Release" to your Branch Protection Rules

![image](https://github.com/livingdocsIO/livingdocs-20min/assets/172394/4859242c-512b-476a-accb-a8fcb1938e99)

6) Commit the changes in github-create-status repo to master



### Local Development
```
# start the service locally
vercel env pull
vercel dev

# call the service locally
curl -d '{"repository":"livingdocs-editor","sha":"your-sha"}' \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -X POST localhost:3000
```

### Call the Service via Command Line
```
curl -d '{"repository":"livingdocs-editor","sha":"your-sha"}' \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -X POST https://gh-release-branch-status.vercel.app
```


### Call the Service via Travis
```
- |
  echo $(curl -d "{\"repository\":\"livingdocs-editor\",\"sha\":\"$TRAVIS_COMMIT\"}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -X POST https://gh-release-branch-status.vercel.app)
```
