# Integrate a virtual mirror with e-commerce products

Virtual try on apps have the full potential to become the next big thing in e-commerce. They relieve much of the stress of going into a store and physically try on different products. They save consumers' time and brands’ budget, serving as a cost-effective yet convenient alternative for trying on products. Most importantly, it makes choosing products we'll love as easy as watching in the mirror.

In this code pattern, we will develop a hybrid mobile application using Mobile First Foundation integrated with recommendation system based on Watson Visual Recognition , which takes in an image of the user as input and detects his/her features(like age, gender, etc) with the help of Watson Visual Recognition model. Based on these features, the recommendation engine returns a personalized recommendation of jewellery products. The user can later try these jewellery products virtually using the virtual mirror feature.

This is a composite pattern and requires you to have a knowledge of the following code pattern:
* [Recommendation system based on visual recognition](https://github.com/IBM/recommender-with-watson-visual-recognition)

When the reader has completed this Code Pattern, they will understand how to:

* Connect to Mobile First Foundation using a mobile application.
* Take inputs from mobile application and do required processing on IBM Cloud.
* Use Watson Visual Recognition using a mobile application.
* Deploy and use cloud foundry applications.
* Access images from Cloud Object Storage using a mobile application.
* Connect and access Db2 on Cloud.

![](doc/source/images/Architecture.png)

## Flow

1. Take input from user's mobile.
2. The input is passed via Mobile First Foundation.
3. Mobile First Foundation passes the user's input to the visual recognition application.
4. The visual recognition application interacts with the Watson Visual Recognition service, which returns appropriate output.
5. The output(age and gender of user) is then send to user's mobile application.
6. The user clicks on "Get Recommendations" button.
7. Requests the recommendation engine to return appropriate recommendation based the visual recognition applications output.
8. Recommendation engine interacts with IBM Db2 to get the necessary product details for the recommended products.
9. Images of the recommended products is retrieved from Cloud Object Storage.
10. Images and details of the recommended products is retrieved by the recommendation engine.
11. Recommendation engine returns the images and details of the recommended products to the user's mobile application.
12. User can click on virtual mirror button to access virtual mirror.
13. Mobile First Foundation passes the user's input to the virtal mirror application.
14. Virtal mirror application gives access to the user.
15. User can view the virtual mirror.

## Pre-requisites

* [IBM Cloud account](https://www.ibm.com/cloud/): Create an IBM Cloud account.
* [Python 3](https://www.python.org/downloads/): Install python 3.
* [Java 1.8.x](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html): Make sure you have required version (Java 1.8.x).

## Steps

Please follow the below to setup and run this code pattern.

1. [Clone the repo](#1-clone-the-repo)
2. [Virtual Mirror Setup](#2-virtual-mirror-setup)
3. [Mobile Application Setup](#3-mobile-application-setup)

### 1. Clone the repo

Clone the repos below from the terminal, run:

```
$ git clone https://github.com/IBM/recommender-with-watson-visual-recognition.git
```
```
$ git clone https://github.com/IBM/virtual-mirror-for-ecommerce.git
```

### 2. Virtual Mirror Setup

* Create a cloud foundry instance [IBM Cloud Foundry Service](https://cloud.ibm.com/catalog/starters/sdk-for-nodejs) and follow set of instructions for deploying JavaScript application to IBM Cloud Foundry.

 <img src="doc/source/images/cloudfoundry.png" alt="Cloud Foundry Virtual Mirror" width="800" border="10" />

<b>NOTE: Make sure the Cloud Foundry App gets at least `256MB` of Memory. You can verify it by going to `IBM Cloud Dashboard > Resources > Cloud Foundry Apps > YOUR_APP_NAME`.</b>

* Use IBM Cloud command line interface to download, modify, and redeploy your Cloud Foundry applications and service instances.

* Before you begin, download and install the IBM Cloud [CLI](https://cloud.ibm.com/docs/cli?topic=cloud-cli-ibmcloud-cli&locale=en-us#overview).

* After you install the command line interface, you can get started.

* Go to the `VirtualMirror` directory.

```
$ cd VirtualMirror
```

* Connect and log in to IBM Cloud.

```
$ ibmcloud api https://api.eu-gb.bluemix.net
```

```
$ ibmcloud login -u example@in.ibm.com -o example@in.ibm.com -s dev
```

>NOTE: If you are using a federated ID, use the `-sso` option.
```
$ ibmcloud login  -o example@in.ibm.com -s dev -sso
```
>NOTE: You must add single or double quotes around `username`, `org_name`, and `space_name` if the value contains a space, for example, `-o "my org"`.

* Finally Deploy the application by following command.
```
$ ibmcloud cf push YOUR-APP-NAME
```
>Example: `ibmcloud cf push virtual-mirror`

* Once you have deployed the application make a note of the `URL` of the instance by right clicking on the `Visit app URL` and copying the link.

  <img src="doc/source/images/cloudfoundryURL.png" alt="Database Storage" width="800" border="10" />

<b>Note: This URL is important as it will be used in step 3.1.2.</b>


### 3. Mobile Application Setup

  The Mobile Application is the component that connects Virtual Mirror and Recommendation Engine.
  
 <b>Note: Now that you have already create the mobile first foundation server from [Recommendation system based on Watson Visual Recognition](https://github.com/IBM/recommender-with-watson-visual-recognition) pattern and configured the MFP cli, you can directly deploy the adapter to the same server by following the steps below:</b>
  
#### 3.1 Deploy the MFP Adapter and Test it
##### 3.1.1 Build and Deploy the MFP adapters
* Go to the `MobileFoundationAdapter` directory inside `App` directory.

```
$ cd MobileFoundationAdapter

$ cd ImagesFetch
```
* Add the `URL` along with the port number `:443` appended with `/mfpadmin`, `User` and `Password` in the `pom.xml` file which is present in `ImagesFetch` directory as show bellow.

<pre><code>
...
<b>&lt;mfpfUrl&gt;https://mobilefoundation-xxxx-xxxxxx.xx-xx.mybluemix.net:443/mfpadmin &lt;/mfpfUrl&gt;</b>
<b>&lt;mfpfUser&gt;admin &lt;/mfpfUser&gt;</b>
<b>&lt;mfpfPassword&gt;******** &lt;/mfpfPassword&gt;</b>
&lt;mfpfRuntime&gt;mfp &lt;/mfpfRuntime&gt;
...
</code></pre>

* Build the `ImagesFetch` adapter as shown below.
```
$ mfpdev adapter build
Building adapter...
Successfully built adapter
```
* Deploy the adapter as shown below.
```
$ mfpdev adapter deploy
Verifying server configuration...
Deploying adapter to runtime mfp on https://mobilefoundation-xxxx-xxxxxx.xx-xx.mybluemix.net:443/mfpadmin...
Successfully deployed adapter
```

> Note: In [Step 5.2] of the [Recommendation system based on Watson Visual Recognition](https://github.com/IBM/recommender-with-watson-visual-recognition) pattern, if you specified `No` to `Make this server the default?`, then you need to specify the name of your server profile (`MyServer` in our case) at the end of `mfpdev adapter deploy` command as shown below.
```
$ mfpdev adapter deploy MyServer
```
##### 3.1.2 Launch MFP dashboard and update adapter configurations
Launch MFP Dashboard as below:
  * In the [IBM Cloud dashboard](https://cloud.ibm.com/dashboard/), under `Cloud Foundry Services`, click on the `Mobile Foundation` service you created in [Step 5.2]. The service overview page that gets shown, will have the MFP dashboard embedded within it. You can also open the MFP dashboard in a separate browser tab by appending `/mfpconsole` to the *url* mentioned in [Step 5].
  * Inside the MFP dashboard, in the list on the left, you will see the `ImagesFetch` adapter listed.

Update MFP Adapter configuration as below:
  * Inside the MFP dashboard, click on the `ImagesFetch` adapter. Under `Configurations` tab, you should see the various properties for accessing Cloud Object Storage, recommendation Engine Api, Visual Recognition and virtual Mirror Api as shown below.

     <img src="doc/source/images/MobileFoundationAdapterDashboard.png" alt="Option to specify the configuration properties for accessing Cloud Object Storage and APIs in deployed MFP Adapter" width="800" border="10" />

  * Please complete the [Recommendation system based on Watson Visual Recognition](https://github.com/IBM/recommender-with-watson-visual-recognition) pattern to get the `Cloud Object Storage Bucket Name`, `Cloud Object Storage API Key`, `Cloud Object Storage Endpoint`, `Cloud Object Storage Service ID`, `Recommendation Engine API URL` & `Visual Recognition API URL` fields.

  * The `Virtual Mirror API URL` can be found in step 2.

  * Click on `Resources` tab. You should see the various REST APIs exposed by `ImagesFetch` adapter as shown below.

     <img src="doc/source/images/MobileFoundationAdapterApis.png" alt="The REST APIs of ImagesFetch adapter" width="800" border="10" />

  >Note: This should replace the existing `ImagesFetch` adapter that you had already deployed in the [Recommendation system based on Watson Visual Recognition](https://github.com/IBM/recommender-with-watson-visual-recognition) pattern.

##### 3.1.3 Test the ImagesFetch adapter
To test the adapter use any REST Clients like [Postman](https://www.getpostman.com/downloads/).
After Installing postman type the `url` created in [step 5.2] and append it with `/mfp/api/adapters/ImagesFetch/resource` and `/objectStorage` to test whether the adapter is establishing connection with Cloud Object Storage.

>Example: `https://mobilefoundation-xxxx-xxxxxx.xx-xx.mybluemix.net/mfp/api/adapters/ImagesFetch/resource/objectStorage`

 * Now click on `Send` button to run the `GET /` API. The API response should get shown in the `Response Body` as shown in snapshot below.

 * The GET API on `/objectStorage` should return a JSON object containing `baseUrl` and `authorizationHeader` as shown below.

  <img src="doc/source/images/TestMFPAdapter_ObjectStorageAccess.png" alt="Test the newly added API in MFP Adapter for getting Cloud Object Storage Authorization token" width="800" border="10" />

 * The GET API on `/recommendationEngine` should return a JSON object containing `recommendationEngineApi` as shown below.

>Example: `https://mobilefoundation-xxxx-xxxxxx.xx-xx.mybluemix.net/mfp/api/adapters/ImagesFetch/resource/recommendationEngine`

   <img src="doc/source/images/TestMFPAdapter_recommendationEngineApi.png" alt="Test the newly added API in MFP Adapter for getting Recommendation Engine API" width="800" border="10" />

 * The GET API on `/visualRecognition` should return a JSON object containing `VisualRecognitionApi` as shown below.

 >Example: `https://mobilefoundation-xxxx-xxxxxx.xx-xx.mybluemix.net/mfp/api/adapters/ImagesFetch/resource/visualRecognition`

   <img src="doc/source/images/TestMFPAdapter_visualRecognition.png" alt="Test the newly added API in MFP Adapter for getting Visual Recognition API" width="800" border="10" />

* The GET API on `/virtualMirror` should return a JSON object containing `VirtualMirrorApi` as shown below.

 >Example: `https://mobilefoundation-xxxx-xxxxxx.xx-xx.mybluemix.net/mfp/api/adapters/ImagesFetch/resource/virtualMirror`

   <img src="doc/source/images/TestMFPAdapter_virtualMirrorApi.png" alt="Test the newly added API in MFP Adapter for getting Visual Recognition API" width="800" border="10" />

#### 3.2 Run application on Android phone
##### 3.2.1 Register the Virtual Mirror App to MFP server

* Go back to `App` directory.
```
$ cd ../App
```

* Register the app as Shown below.
```
$ mfpdev app register
Verifying server configuration...
Registering to server:'https://mobilefoundation-xxxx-xxxxxx.xx-xx.mybluemix.net:443' runtime:'mfp'
Updated config.xml file located at: .../Ionic-MFP-App/IonicMobileApp/config.xml
Run 'cordova prepare' to propagate changes.
Registered app for platform: android
```
> Note: In [Step 5.2] of the [Recommendation system based on Watson Visual Recognition](https://github.com/IBM/recommender-with-watson-visual-recognition) pattern, if you specified `No` to `Make this server the default?`, then you need to specify the name of your server profile (`MyServer` in our case) at the end of `mfpdev app deploy` command as shown below.
`$ mfpdev app register MyServer`

> Note: To Propagate changes by running `cordova prepare`


##### 3.2.2 Build/Run the Ionic application on Android phone

* Build Android application
```
$ ionic cordova build android
```
<b>Note: The `build` & `run` commands should be executed in the `App` directory and not else where.</b>

<b>Note: Make sure you Connect the Android phone to your development machine by USB cable, and accept the adb access permissions.</b>

* Run application on Android device
```
$ ionic cordova run android
```
  <img src="doc/source/images/Screenshots/camerapermission.png" alt="Camera" width="240" />  <img src="doc/source/images/Screenshots/storagepermission.png" alt="Camera" width="240" />

* Allow the <b>Camera Permission</b> and <b>Storage Permission</b> when prompted. Without this the virtual mirror will not work.
  >NOTE: <b>Storage Permission</b> will be asked only if you choose to select a picture from camera.
  
  >NOTE: If there is not camera prompt in your mobile device follow step 4 from `TROUBLESHOOTING.md` to fix it.
  <img src="doc/source/images/Screenshots/watsonoptions.png" alt="Options" width="240"  /> 

* To get your age and gender either click a picture or choose an existing picture. 

  <img src="doc/source/images/Screenshots/recommendation1.png" alt="Recommendations" width="240"  /> 

* A list of Jewellery will be Recommended based on your age and gender.

  <img src="doc/source/images/Screenshots/virtualmirror.png" alt="VirtualMirror" width="240"  /> 

* You can select any Jewellery to view it virtually on your face in real-time.


##### 3.2.3 Update App Logo and Splash (Optional)

Reference: Automating Icons and Splash Screens https://blog.ionicframework.com/automating-icons-and-splash-screens/

Copy your desired app icon to `App/resources/icon.png` and app splash to `App/resources/splash.png`.

```
$ ionic cordova resources
```

For running `ionic cordova resources` command, you would need to sign up on [ionicframework.com](https://ionicframework.com/) and specify the credentials on the command line.

#### 3.3 Build APK for uploading to Google Play Store (Optional)

Reference: https://ionicframework.com/docs/intro/deploying/

* Add following lines at the end of `App/platforms/android/app/src/main/proguard-project-mfp.txt`:
```
-dontwarn okhttp3.internal.huc.**
```

* Create release build as below:
```
$ cd ../App

$ ionic cordova build android --prod --release
```

* Set `ANDROID_HOME` environment variable as per instructions in [Step x.x]. On Mac, this is usually:
```
export ANDROID_HOME=/Users/<username>/Library/Android/sdk
```

* Zip align release build as below:
```
$ cd ./platforms/android/build/outputs/apk/
$ ls
android-release-unsigned.apk
$ $ANDROID_HOME/build-tools/28.0.3/zipalign -v -p 4 android-release-unsigned.apk android-release-unsigned-aligned.apk
$ ls
android-release-unsigned-aligned.apk	android-release-unsigned.apk
```

* Create self signing certificate as below:

Make a note of the `Keystore password` that you set. You would need it for signing your APK.

```
$ keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias

Enter keystore password:
Re-enter new password:
What is your first and last name?
  [Unknown]:  xxxxx xxxxx
What is the name of your organizational unit?
  [Unknown]:  XXX
What is the name of your organization?
  [Unknown]:  XXX
What is the name of your City or Locality?
  [Unknown]:  xxxxxxxx
What is the name of your State or Province?
  [Unknown]:  xxxxxxxx
What is the two-letter country code for this unit?
  [Unknown]:  XX
Is CN=xxxxxx xxxxx, OU=XXX, O=XXX, L=xxxxxxxx, ST=xxxxxxxx, C=XX correct?
  [no]:  yes

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10,000 days
	for: CN=xxxxx xxxxx, OU=XXX, O=XXX, L=xxxxxxxx, ST=xxxxxxxx, C=XX
Enter key password for <my-alias>
	(RETURN if same as keystore password):
[Storing my-release-key.jks]

$ ls
android-release-unsigned-aligned.apk	android-release-unsigned.apk		my-release-key.jks
```

* Self sign APK as below:
```
$ $ANDROID_HOME/build-tools/28.0.3/apksigner sign --ks my-release-key.jks --out thejewellerystore.apk android-release-unsigned-aligned.apk
Keystore password for signer #1:
$ ls
android-release-unsigned-aligned.apk	my-release-key.jks
android-release-unsigned.apk		thejewellerystore.apk
$
```

* Distribute `thejewellerystore.apk` by uploading to Google Play Store or to your company's internal App store.

## Troubleshooting

### Debugging Android hybrid app using Chrome Developer Tools

Please see [troubleshooting guide](TROUBLESHOOTING.md) for solutions to some commonly occuring problems.

* Install Google Chrome
* Open Google Chrome. Open URL `chrome://inspect/#devices`
* Connect your mobile phone to the deployment device via USB cable and you should see your device name listed on the page as shown.

  <img src="doc/source/images/DebugAndroidAppWithChromeDeveloperTools.png" alt="Debugging of Android app using Chrome Developer Tools" width="800" border="10" />

* Under `Devices`, click on `inspect` below your connected device.

  <img src="doc/source/images/DebugAndroidConsole.png" alt="Debugging of Android app using Chrome Developer Tools Console" width="800" border="10" />

* You can see the console logs here for every action that the app performs.

<!-- keep this -->
## License

[Apache 2.0](LICENSE)
