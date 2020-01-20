# SmartSolesApp

Run instructions for iOS:
• `cd /path/to/project && npx react-native run-ios`
- or -
• Open SmartSolesApp/ios/SmartSolesApp.xcworkspace in Xcode or run "xed -b ios"
• Hit the Run button

Run instructions for Android:
• Have an Android emulator running (quickest way to get started), or a device connected.
• `cd /path/to/project && npx react-native run-android`


## Installation instructions 
Create a file called local.properties in the Android directory and add the following line:
sdk.dir = /Path/to/Android/sdk

If you get the error: 

Error: Failed to load plugin '@react-native-community' declared in '.eslintrc.js » @react-native-community/eslint-config': Cannot find module '@react-native-community/eslint-plugin'
Require stack:

Run the following command: 

`yarn add --dev eslint @react-native-community/eslint-plugin`
