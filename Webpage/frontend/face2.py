import cv2
import numpy as np
import face_recognition
from datetime import datetime

from flask import Flask, render_template, Response,request,redirect
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
import os
path = 'image'
images = []
classNames = []
li = os.listdir(path)
for cls in li:
    current = cv2.imread(f'{path}/{cls}')
    images.append(current)
    classNames.append(os.path.splitext(cls)[0])

def findEncodings(images):
    encodeLi = []
    for i in images:
        img = cv2.cvtColor(i,cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeLi.append(encode)
    return encodeLi

encodeLiKnown = findEncodings(images)
print('Encoding is done')

cam = cv2.VideoCapture(0)
name = ''
def response():
    global name
    i = 0
    while True:
        succes, img = cam.read()
        imgSmall = cv2.resize(img,(0,0),None,0.25,0.25)
        imgSmall = cv2.cvtColor(imgSmall,cv2.COLOR_BGR2RGB)
        faceCur = face_recognition.face_locations(imgSmall)
        encodeCur = face_recognition.face_encodings(imgSmall,faceCur)

        for encodeFace, faceLoc in zip(encodeCur,faceCur):
            match = face_recognition.compare_faces(encodeLiKnown,encodeFace)
            faceDis = face_recognition.face_distance(encodeLiKnown,encodeFace)
            print(faceDis)
            mathcInd = np.argmin(faceDis)
            print(i)
            i += 1
            if match[mathcInd]:
                name = classNames[mathcInd].upper()
                print(name)
                (y1,x2,y2,x1) = faceLoc
                (y1,x2,y2,x1) = (y1*4,x2*4,y2*4,x1*4)
                app.config['authenticated'] = True
                cam.release()
                cv2.destroyAllWindows()
                return name
            
            elif i > 10:
                return 'None'

            

print(name)
# @app.route('/',methods = ['POST','GET'])
# def index():
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']
#         print(username,password)
#         if username == 'admin' and password == 'password':
#             return redirect('/video_feed')
#         else:
#             return render_template('login.html', error='Invalid username or password')
#     else:
#         return render_template('login.html')
@app.route('/')
def index():
    authenticated = app.config.get('authenticated', False)
    return render_template('add.html',authenticated=authenticated)
@app.route('/video_feed',methods = ['POST'])
def video_feed():
    return Response(response(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/getName',methods=['POST'])
def getName():
    print('name',name)
    print('here')
    data = request.json['data']
    print(data)
    return data


if __name__ == '__main__':
    app.run(debug=True)
    