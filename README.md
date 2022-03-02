# ow-self-care

## eero Interface
eero has a very nice interface. We should look at it and make sure we have similar experience and functionality. This [file](https://github.com/stephb9959/ow-self-care/blob/main/eero-app.docx) contains images taken from the eero experience.

## Developer Setup
The current expectation is to be using 'yarn' as the package manager and to be using Prettier as source code formatter. 

To run use the following
- yarn react-native start

To run either iOS or Android simulator builds:
- yarn react-native run-ios
- yarn react-native run-android

## Updating to the Latest

The following should be done to get the packages
- yarn upgrade
- cd ios && pod install

The following should be done to get the latest React Native version
- yarn react-native upgrade

## Developer Extra Functions
To generate the APIs from OpenAPI yaml you can run the following commands:
- yarn generate:userportal-apis

Currently only userportal-apis is needed, the others are currently here for expected future enhancement. !! The userportal-apis generation is dependent on the file /api/open-api/userportal.yaml. This file will need to be updated manually to have any changes. The other generations use a direct link to an URL and they will automatically get the latest.

To generate resized device images from raw files run the following:
- yarn generate:assets

Note that this requires ImageMagic to be installed. See https://github.com/kevva/resize-img-cli. The files in this directory should match exactly the names of the deviceTypes for the Access Points. As well, this will require a code change to associate the correct file with the correct image. 

# Release Builds

To generate an Android release build, you will need to ensure the following
- The file release.keystore exists in android/app
- The local file ~/.gradle/gradle.properties is configured properly, see android/gradle.properties for what is needed

To create:
- Update the package version number in package.json
- yarn react-native-version --never-amend --increment-build
- cd android
- ./gradlew bundleRelease

Resulting file will be in android/app/build/outputs/bundle/release/. It should be renamed to MyOpenWifi.aab

## Other access
You can access the current stack as follows:
- GatewayUI (more technician side): https://14oranges-ui.arilia.com
- Provisioning UI: https://14oranges-prov.arilia.com

The default username for now is: tip@ucentral.com password is 'openwifi'

## The system
There are 2 applications: gateway UI and Provisioning. Most of the work will be done in the provisioning. All the API use the OpenAPI standard definition. The system works with 4 microservices working together to provide the functionality. The services can be reached over individual ports. 

## Support APIs
- [User Portal](https://github.com/stephb9959/wlan-cloud-sub)
- [User Portal API](https://github.com/stephb9959/wlan-cloud-sub/blob/main/openapi/userportal.yaml)

## Available UIs
- [Gateway UI](https://github.com/stephb9959/wlan-cloud-ucentralgw-ui)
- [Provisioning UI](https://github.com/stephb9959/ow-prov)

## How to use the API
To see hos the API is used, take a look at the project, go into `test_scripts/curl` and this will show you how to login and perform some calls.

## Authenticating
To authenticate, you will need to send an oauth2 message to the security service, obtain a token, and use that token in all subsequent calls to the services. Once the session is over, just call logout.