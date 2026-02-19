# Description

This is a small helper service to add a check to the github status for release branches.

### Example GitHub Status

![image](https://user-images.githubusercontent.com/172394/48440494-52c55500-e789-11e8-897b-61fdf7250ed6.png)

# How to use

## Register Semantic Release Check on GitHub for PRs

### 1) Update drone.yml of your MSP

![image](https://github.com/livingdocsIO/livingdocs-server/assets/172394/367ce840-8ad9-4480-8e0b-c0b98e0d5194)

Add script to drone.yml (usually in the linting step). Attention: If there is a common trigger like `trigger: event: [push]`, the script will not be executed.

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

### 2) Trigger the repo (one time)

To enable the whole Semantic Release mechanism, you have to trigger the MSP repo one time with:

```
curl -d '{"repository":"livingdocs-<your-msp-repo>","sha":"take-a-sha-from-an-open-pr-from-the-msp-repo"}' \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -X POST https://gh-release-branch-status.vercel.app
```

The call should return a message like `{"message":"GitHub check updated with status 'no-release-branch' on pull request https://github.com/livingdocsIO/livingdocs-nrk/pull/297 ."}`

If not already added by DevOps, go to the Github Settings and add the status check "Semantic Release" to your Rules/Rulesets to both branches (main and release)

![image](https://github.com/user-attachments/assets/126b2ee6-6dc0-44d2-92ee-8626b2139933)

## Local Development

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

## Call the Service via Command Line

```
curl -d '{"repository":"livingdocs-editor","sha":"your-sha"}' \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -X POST https://gh-release-branch-status.vercel.app
```

## Call the Service via Travis

```
- |
  echo $(curl -d "{\"repository\":\"livingdocs-editor\",\"sha\":\"$TRAVIS_COMMIT\"}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -X POST https://gh-release-branch-status.vercel.app)
```
