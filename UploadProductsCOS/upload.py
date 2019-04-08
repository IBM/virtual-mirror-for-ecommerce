
import json
import os
import re
import ibm_boto3
from ibm_botocore.client import Config
import sys
import requests

fileToUpload = ['Hanging/hanging1.png', 'Hanging/hanging2.png', 'Hanging/hanging3.png', 'Hanging/hanging4.png',
                'Hoop/hoop1.png', 'Hoop/hoop2.png', 'Hoop/hoop3.png', 'Hoop/hoop4.png',
                'Stud/stud1.png', 'Stud/stud2.png', 'Stud/stud3.png', 'Stud/stud4.png',
                'Nosehoop/nh1.png', 'Nosehoop/nh2.png', 'Nosehoop/nh3.png', 'Nosehoop/nh4.png',
                'Nosestud/ns1.png', 'Nosestud/ns2.png', 'Nosestud/ns3.png', 'Nosestud/ns4.png',
                'Barbell/barbell1.png', 'Barbell/barbell2.png', 'Barbell/barbell3.png', 'Barbell/barbell4.png']

# have a separate credentials.json file where the credentials of your bucket associated with notebook is listed
with open('credentials1.json') as data_file:
    credentials = json.load(data_file)

# connect to IBM cloud object storage
endpoints = requests.get(credentials.get('endpoints')).json()
iam_host = (endpoints['identity-endpoints']['iam-token'])
cos_host = (endpoints['service-endpoints']['cross-region']['us']['public']['us-geo'])
api_key = credentials.get('apikey')
service_instance_id = credentials.get('resource_instance_id')

# Constrict auth and cos endpoint
auth_endpoint = "https://" + iam_host + "/oidc/token"
service_endpoint = "https://" + cos_host

cos = ibm_boto3.client('s3',
                    ibm_api_key_id=api_key,
                    ibm_service_instance_id=service_instance_id,
                    ibm_auth_endpoint=auth_endpoint,
                    config=Config(signature_version='oauth'),
                    endpoint_url=service_endpoint)

# name of the bucket in the cloud object storage associated with notebook
bucket_name='XXXXXX'
try:
    fileobject1=cos.upload_file('co_200.csv',bucket_name,'co_200.csv')
    print("Dataset Uploaded")
except Exception as e:
    print("Error Uploading Dataset")


header={'ACL': 'public-read'}
for item in fileToUpload:
    try:
        fileobject1=cos.upload_file(item,bucket_name,item,ExtraArgs=header)
        print(item+" Uploaded")
    except Exception as e:
        print(item+" Upload Failed")


print("Upload Complete!\n")
