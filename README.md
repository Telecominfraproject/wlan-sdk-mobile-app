# ow-self-care

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

## Release Builds

To generate an Android release build, you will need to ensure the following
- The file release.keystore exists in android/app
- The local file ~/.gradle/gradle.properties is configured properly, see android/gradle.properties for what is needed

To create:
- Update the package version number in package.json
- yarn react-native-version --never-amend
- cd android
- ./gradlew bundleRelease

Resulting file will be in android/app/build/outputs/bundle/release/. It should be renamed to MyOpenWifi.aab

## User Portal

The backend that the App communicate with is the OpenWifi User Self Care Portal
- [User Portal](https://github.com/telecominfraproject/wlan-cloud-userportal)