from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB 클라이언트 설정
client = MongoClient('mongodb+srv://moondy2209:A3ykBYjy9iGaeUF4@cluster0.t0cskbu.mongodb.net/?retryWrites=true&w=majority')
db = client.dbjungle

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/memo', methods=['GET'])
def read_memos():
    result = list(db.memos.find({}, {'_id': 0}))
    return jsonify({'result': 'success', 'memos': result})

@app.route('/memo', methods=['POST'])
def post_memo():
    title_receive = request.form['title_give']
    text_receive = request.form['text_give']
        
    memo = {'title': title_receive, 'text': text_receive}
    db.memos.insert_one(memo)

    return jsonify({'result': 'success', 'msg': 'POST 연결되었습니다!'})

@app.route('/edit_memo', methods=['POST'])
def edit_memo():
    original_title = request.form['originalTitle']
    edited_title = request.form['editedTitle']
    edited_text = request.form['editedText']

    db.memos.update_one({'title': original_title}, {'$set': {'title': edited_title, 'text': edited_text}})
    
    return jsonify({'result': 'success'})

@app.route('/delete_memo', methods=['POST'])
def delete_memo():
    index = int(request.form['index'])
    memo = list(db.memos.find({}, {'_id': 1}))[index]
    db.memos.delete_one({'_id': memo['_id']})
    return jsonify({'result': 'success'})

if __name__ == '__main__':  
    app.run('0.0.0.0', port=5000, debug=True)


