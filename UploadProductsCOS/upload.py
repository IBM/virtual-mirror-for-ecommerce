
import json
import os
import re
import ibm_boto3
from ibm_botocore.client import Config, ClientError
import sys
import requests

fileToUpload = ['static/Hanging/hanging1.png', 'static/Hanging/hanging2.png', 'static/Hanging/hanging3.png', 'static/Hanging/hanging4.png',
                'static/Hoop/hoop1.png', 'static/Hoop/hoop2.png', 'static/Hoop/hoop3.png', 'static/Hoop/hoop4.png',
                'static/Stud/stud1.png', 'static/Stud/stud2.png', 'static/Stud/stud3.png', 'static/Stud/stud4.png',
                'static/Nosehoop/nh1.png', 'static/Nosehoop/nh2.png', 'static/Nosehoop/nh3.png', 'static/Nosehoop/nh4.png',
                'static/Nosestud/ns1.png', 'static/Nosestud/ns2.png', 'static/Nosestud/ns3.png', 'static/Nosestud/ns4.png',
                'static/Barbell/barbell1.png', 'static/Barbell/barbell2.png', 'static/Barbell/barbell3.png', 'static/Barbell/barbell4.png']

# Constants for IBM COS values
COS_ENDPOINT = ""
COS_API_KEY_ID = ""
COS_AUTH_ENDPOINT = ""
COS_RESOURCE_CRN = ""
COS_BUCKET_LOCATION = "us-standard"
bucket_name = "XXXX"

'''Cloud Object Storage Methods'''
# have a separate credentials1.json file where the credentials of your bucket associated with notebook is listed
with open('credentials1.json', 'r') as credentialsFile:
    credentials = json.loads(credentialsFile.read())

# connect to IBM cloud object storage
endpoints = requests.get(credentials.get('endpoints')).json()
iam_host = (endpoints['identity-endpoints']['iam-token'])
cos_host = (endpoints['service-endpoints']
            ['cross-region']['us']['public']['us-geo'])

# Constrict auth and cos endpoint
auth_endpoint = "https://" + iam_host + "/oidc/token"
service_endpoint = "https://" + cos_host

# Constants for IBM COS values
COS_ENDPOINT = service_endpoint
COS_API_KEY_ID = credentials.get('apikey')
COS_AUTH_ENDPOINT = auth_endpoint
# eg "crn:v1:bluemix:public:cloud-object-storage:global:a/3bf0d9003abfb5d29761c3e97696b71c:d6f04d83-6c4f-4a62-a165-696756d63903::"
COS_RESOURCE_CRN = credentials.get('resource_instance_id')

# Create client
cos = ibm_boto3.resource("s3",
                         ibm_api_key_id=COS_API_KEY_ID,
                         ibm_service_instance_id=COS_RESOURCE_CRN,
                         ibm_auth_endpoint=COS_AUTH_ENDPOINT,
                         config=Config(signature_version="oauth"),
                         endpoint_url=COS_ENDPOINT
                         )


def multi_part_upload(bucket_name, item_name, file_path):
    try:
        print("Starting file transfer for {0} to bucket: {1}\n".format(
            item_name, bucket_name))
        # set 5 MB chunks
        part_size = 1024 * 1024 * 5

        # set threadhold to 15 MB
        file_threshold = 1024 * 1024 * 15

        # set the transfer threshold and chunk size
        transfer_config = ibm_boto3.s3.transfer.TransferConfig(
            multipart_threshold=file_threshold,
            multipart_chunksize=part_size
        )

        # the upload_fileobj method will automatically execute a multi-part upload
        # in 5 MB chunks for all files over 15 MB
        with open(file_path, "rb") as file_data:
            cos.Object(bucket_name, item_name).upload_fileobj(
                Fileobj=file_data,
                Config=transfer_config
            )

        print("Transfer for {0} Complete!\n".format(item_name))
    except ClientError as be:
        print("CLIENT ERROR: {0}\n".format(be))
    except Exception as e:
        print("Unable to complete multi-part upload: {0}".format(e))


multi_part_upload(bucket_name, 'co_200.csv', 'static/co_200.csv')

for item in fileToUpload:
    multi_part_upload(bucket_name, item.split(
        '/')[1]+'/'+item.split('/')[2], item)
