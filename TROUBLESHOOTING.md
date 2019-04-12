#### 1. Problems with Java Version
* If you have java version different from `1.8.x` already installed in your Mac, then you can simply run this command to uninstall existing java version.
```
$ sudo rm -rf /Library/Java/JavaVirtualMachines/jdk<version>.jdk
```
* After uninstalling the existing version you can download java version `1.8.x` from [here](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
```
$ java -version
java version "1.8.0_101"
```

#### 2. Problems related to MobileFirst Foundation Server
* During step 5.2 if you are unable to add server and if you get some message as shown bellow,
```
$ mfpdev server add
? Enter the name of the new server profile: MyServer
? Enter the fully qualified URL of this server: https://mobilefoundation-xxxx-xxxxxx.xx-xx.mybluemix.net:443
? Enter the MobileFirst Server administrator login ID: admin
? Enter the MobileFirst Server administrator password: ****
? Save the administrator password for this server?: No
? Enter the context root of the MobileFirst administration services: mfpadmin
? Enter the MobileFirst Server connection timeout in seconds: 30
? Make this server the default?: No
Verifying server configuration...
Cannot connect to server 'MyServer' at 'https://mobilefoundation-xxxx-xxxxxx.xx-xx.mybluemix.net:443'.
Failed to set runtime details.: Unexpected token N in JSON at position 4: HTTP 404 - Not Found
Error: The 'mfpdev server add' command has failed.
```
probably the server is not yet running. Wait for sometime and try again. 

* If the problem still persists you can delete the MobileFoundation & MobileFoundation Server resource and create it once again.

#### 3. Problem Testing the ImageFetch adapter
* In step 5.4.3, if the postman is showing a response on either,
```
Error 502: Registered endpoint failed to handle the request
``` 
or if its showing,
```
Error 500: Service unavailable. Rutime out of sync
```
or something similar to these messages that is if you get `5xx` errors you can follow this [IBM Support](https://www-01.ibm.com/support/docview.wss?uid=swg1PI54057) page to fix it.

* If the problem still persists you can delete the MobileFoundation & MobileFoundation Server resource and create it once again.

#### 4. Problem Building/Running the Ionic application on Android phone
* In case the Cordova build fails due to missing `ANDROID_HOME` and `JAVA_HOME` environment variables, then set those environment variables as per instructions in https://cordova.apache.org/docs/en/latest/guide/platforms/android/#setting-environment-variables. `ANDROID_HOME` should be set to the `Android SDK Location`. Command `/usr/libexec/java_home` returns the value to be used for setting `JAVA_HOME` on [macOS](https://mattshomepage.com/articles/2016/May/22/java_home_mac_os_x/). On other platforms you could run `java -XshowSettings:properties 2>&1 | grep 'java.home'` as mentioned [here](http://sbndev.astro.umd.edu/wiki/Finding_and_Setting_JAVA_HOME#Sample_Perl_Script:_java_home).


* If you get error related to Cordova platform, or if you do not get the permissions prompt on your phone you can do the following.

* Remove current Cordova platform.
```
$ ionic cordova platform remove android
```

* Add Cordova platform for Android.
```
$ ionic cordova platform add android@6.4.0
...
```

> Note: Make sure the Cordova platform version being added is supported by the MobileFirst plug-ins. Site https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/application-development/sdk/cordova/ lists the supported levels.

```
$ cordova platform version
Installed platforms:
	 android 6.4.0
Available platforms:
	 browser ~4.1.0
	 ios ~4.4.0
	 osx ~4.0.1
	 webos ~3.7.0
```
* If you still get errors with respect to cordova you can do the following.

* Delete the `Node_Modules` directory from the `JewelleryStoreApp` directory.

* In `JewelleryStoreApp` directory run the command.
```
$ npm install
...
```

* Add all the dependent Cordova plugins again, by running the following commands.

* To add Camera Plugin run the following.
```
$ ionic cordova plugin add cordova-plugin-camera && npm install @ionic-native/camera
```
* To add Camera-Preview Plugin run the following.
```
$ ionic cordova plugin add cordova-plugin-camera-preview && npm install @ionic-native/camera-preview
```
* To add Permissions Plugin run the following.
```
ionic cordova plugin add cordova-plugin-android-permissions && npm install @ionic-native/android-permissions
```
* To add mfp Plugin run the following.
```
$ ionic cordova plugin add cordova-plugin-mfp
```
* To add Files Plugin run the following.
```
$ ionic cordova plugin add cordova-plugin-file && npm install @ionic-native/file

$ ionic cordova plugin add cordova-plugin-file-transfer && npm install @ionic-native/file-transfer

$ ionic cordova plugin add cordova-plugin-filechooser && npm install @ionic-native/file-chooser

$ ionic cordova plugin add cordova-plugin-filepath && npm install @ionic-native/file-path

```

#### 5. Problem with node version
* If you have a node version lower than (8.x) then you will have to run the following command in the `JewelleryStoreApp` directory.
```
$ npm rebuild node-sass
```
