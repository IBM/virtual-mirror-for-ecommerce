import numpy as np
import json
import os
import re
import ibm_boto3
import ibm_db
import msgpack
from ibmdbpy import IdaDataBase, IdaDataFrame
from ibm_botocore.client import Config
from flask_cors import CORS
import pandas as pd
from matplotlib import pyplot as plt
from flask import Flask, jsonify, json, request
from sklearn.cluster import KMeans
import requests
plt.rcParams['figure.figsize'] = (16, 9)
plt.style.use('ggplot')
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] =False
CORS(app)
# app = Flask(__name__)


#connecting to DATABASE

#database credentials
credentials_1 = {
    'username': 'xxxx',
    'password': 'xxxx',
    'database': 'BLUDB',
    'host': 'xxxx',
    'port': 'xxxx',
}

dsn_driver = "IBM DB2 ODBC DRIVER"
dsn_database = credentials_1['database']
dsn_hostname = credentials_1['host']
dsn_port = "50000"
dsn_uid = credentials_1['username']
dsn_pwd = credentials_1['password']

dsn = (
    "DRIVER={{IBM DB2 ODBC DRIVER}};"
    "DATABASE={0};"
    "HOSTNAME={1};"
    "PORT={2};"
    "PROTOCOL=TCPIP;"
    "UID={3};"
    "PWD={4};").format(dsn_database, dsn_hostname, dsn_port, dsn_uid, dsn_pwd)

conn = ibm_db.connect(dsn, "", "")

insert = 'SELECT * FROM xxxx'
stmt = ibm_db.exec_immediate(conn, insert)
records={}
count=0
dictionary = ibm_db.fetch_assoc(stmt)
records[count]=dictionary
while dictionary != False:
    count=count+1
    dictionary = ibm_db.fetch_assoc(stmt)
    records[count]=dictionary


filename='co_200.csv'
#have a separate credentials.json file where the credentials of your bucket associated with notebook is listed
with open('credentials1.json') as data_file:
    credentials = json.load(data_file)
#connect to IBM cloud object storage
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
#name of the bucket in the cloud object storage associated with notebook
bucket_name='xxxxxx'
fileobject = cos.get_object(Bucket=bucket_name, Key=filename)['Body']
data=pd.read_csv(fileobject)


bucket=cos.list_objects(Bucket=bucket_name)
bucket_contents=bucket['Contents']
lst=[]

for files in bucket_contents:
    if(files['Key'].endswith('png')):
        lst.append(files['Key'])


stud_list=[]
hanging_list=[]
hoop_list=[]
nose_stud_list=[]
nose_hoop_list=[]
barbell_list=[]
for file in lst:
    # dict2={"name":"","img":"","height":0,"width":0}
    img_details={"img":"","height":0,"name":"","width":0,"price":0}
    img_name=re.split('/|\.',file)
    image_name=img_name[1]
    index=-1
    for rec in range(0,len(records)-1):
        index=index+1
        if(image_name == records[index]["PID"]):
            img_details["img"]=file
            pid = records[index]["PID"]
            img_details["height"]=records[index]["HEIGHT"]
            img_details["width"]=records[index]["WIDTH"]
            img_details["price"]=records[index]["PRICE"]
            img_details["name"]=image_name
    if image_name.startswith("stud"):
        stud_list.append(img_details)
    elif image_name.startswith("hanging"):
        hanging_list.append(img_details)
    elif image_name.startswith("hoop"):
        hoop_list.append(img_details)
    elif image_name.startswith("ns"):
        nose_stud_list.append(img_details)
    elif image_name.startswith("nh"):
        nose_hoop_list.append(img_details)
    elif image_name.startswith("barbell"):
        barbell_list.append(img_details)



@app.route("/",methods=["GET"])
def hello():
    title=["Stud","Hanging","Hoop","Nosestud","Nosehoop","Barbell"]
    #prepare the data
    if 'age' in request.args:
        age=int(request.args['age'])
    if 'gender' in request.args:
        gender=request.args['gender']

    f0 = data['Stud'].values
    f0 = np.append(f0, 0)
    f1 = data['Gender'].values
    f1 = np.append(f1, gender)
    f2 = data['Age'].values
    f2 = np.append(f2, age)
    f3 = data['Hanging'].values
    f3 = np.append(f3, 0)
    f5 = data['Hoop'].values
    f5 = np.append(f5, 0)
    f6 = data['Nosestud'].values
    f6 = np.append(f6, 0)
    f7= data['Nosehoop'].values
    f7 = np.append(f7, 0)
    f8 = data['Barbell'].values
    f8 = np.append(f8, 0)
    f4 = [ord(n) for n in f1]
    Y = np.array(list(zip(f0, f3, f5, f6, f7, f8, f4, f2)))
    #cluster the data using KMeans Algorithm
    kmeans = KMeans(max_iter=50, n_clusters=10)
    kmeans = kmeans.fit(Y)
    labels = kmeans.predict(Y)
    centroids = kmeans.cluster_centers_

    counts={0:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0},1:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0},2:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0},3:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0},4:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0},5:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0},6:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0},7:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0},8:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0},9:{"Stud":0,"Hanging":0,"Hoop":0,"Nosestud":0,"Nosehoop":0,"Barbell":0}}
    prod={0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[]}
    #list all the products that are purchased by all the users, cluster wise
    for record in range(0,217):
        cluster_id=labels[record]
        for attr in range(len(title)):
            if(Y[record][attr]==1):
                current_products=title[attr]
                counts[cluster_id][title[attr]]=counts[cluster_id][title[attr]]+1
        lst=prod[cluster_id]
        if current_products not in lst:
            lst.append(current_products)
        prod[cluster_id]=lst
    #delete entries of products from counts that hasn't been purchased even once,cluster wise
    for cluster in range(10):
        for attr in title:
            if(counts[cluster][attr]==0):
                del counts[cluster][attr]
    #identify the cluster of new user and pass the json object that has recommended products
    label=labels[217]
    # dict1={"type":"","category":0,"count":0,"products":""}
    product_details={"products":"","type":"","count":0,"category":0}
    count_keys=[]
    count_values=[]
    recommended_products=[]
    for id in range(10):
        if(label==id):
            for attr in counts[id].keys():
                count_keys.append(attr)
                count_values.append(counts[id][attr])
            for key in range(len(count_keys)):
                product_details["category"]=count_keys[key]
                product_details["count"]=count_values[key]
                if(count_keys[key]=="Stud" or count_keys[key]=="Hanging" or count_keys[key]=="Hoop"):
                    product_details["type"]="Ear"
                    if(count_keys[key]=="Stud"):
                        product_details["products"]=stud_list
                    elif(count_keys[key]=="Hanging"):
                        product_details["products"]=hanging_list
                    elif(count_keys[key]=="Hoop"):
                        product_details["products"]=hoop_list
                elif(count_keys[key]=="Nosestud" or count_keys[key]=="Nosehoop" or count_keys[key]=="Barbell"):
                    product_details["type"]="Nose"
                    if(count_keys[key]=="Nosestud"):
                        product_details["products"]=nose_stud_list
                    elif(count_keys[key]=="Nosehoop"):
                        product_details["products"]=nose_hoop_list
                    elif(count_keys[key]=="Barbell"):
                        product_details["products"]=barbell_list
                recommended_products.append(product_details.copy())
            jsonStr=json.dumps(recommended_products)
            return jsonify(json.loads(jsonStr))

port = os.getenv('VCAP_APP_PORT', '8080')
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',port=port)
    #app.run(debug=True)
