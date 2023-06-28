from flask import Flask,request, url_for, redirect, render_template
import pickle
import numpy as np

app = Flask(__name__)

model=pickle.load(open('model.sav','rb'))


@app.route('/')
def hello_world():
    return render_template("index(1).html")


@app.route('/predict',methods=['POST','GET'])
def predict():  
    print([x for x in request.form.values()])
    int_features=[int(x) for x in request.form.values()]
    final=[np.array(int_features)]   
    print(int_features)
    print(final)
    prediction=model.predict(final)
    if prediction[0] == 1:
        return render_template('index(1).html',pred='Student is good.\nHigh chance of passing  {}'.format(prediction[0]),bhai="Students will pass the next test")
    else:
        return render_template('index(1).html',pred='Do check up on the student.\n High chance of failing {}'.format(prediction[0]),bhai="Your Forest is Safe for now")


if __name__ == '__main__':
    app.run(debug=True, port=80)
