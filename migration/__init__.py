import os
import subprocess
import csv
import glob
import json
from flask import Flask, request, jsonify, session, redirect
from flask import render_template


def get_user_type(username,password):

    authenticated = False
    if (username == 'developer' and password == 'developer'):
        return username, True

    elif (username == 'operator' and password == 'operator'):
        return username, True

    else:
        return "", False



app = Flask(__name__)
app.config['SECRET_KEY'] = 'f18967deeee433fb67a0d6f7422067d7'

# @app.route('/')
# def index():
#     print ("I am in index page")
#     return app.send_static_file('partial/index.html')

@app.route('/')
def index():
    return render_template('index.html')

# @app.route('/')
# def layout():
#     print ('layout')
#     # return redirect('home')
#     return render_template('layout.html')


@app.route('/api/login', methods=['POST'])
def login():
    json_data = request.json
    print('json_data--',json_data)
    username = json_data['username']
    password = json_data['password']

    user_type,authenticated = get_user_type(username,password)

    if authenticated:
        session['logged_in'] = True
        # session['user_type'] = user_type
        status = True
    else:
        status = False

    print("Login status--", status)
    return jsonify({'result': status})


@app.route('/api/logout')
def logout():
    session.pop('logged_in', None)
    return jsonify({'result': 'success'})


@app.route('/api/status')
def status():
    print("status---")
    if session.get('logged_in'):
        if session['logged_in']:
            print({'status': True})
            return jsonify({'status': True})
    else:
        print({'status': False})
        return jsonify({'status': False})

