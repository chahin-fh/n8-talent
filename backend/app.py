from flask import Flask, jsonify, request, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from src.util import *
from collections import Counter
import bcrypt
import random

app = Flask(__name__)
set_config(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

db = SQLAlchemy(app)

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(64), unique=False, nullable=False)
	electronic_mail = db.Column(db.String(256), unique=True, nullable=False)
	password = db.Column(db.String(128), unique=False, nullable=False)
	compt = db.Column(db.String(1024), unique=False, nullable=False)
	lang = db.Column(db.String(1024), unique=False, nullable=False)
 
class Project(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64), unique=False, nullable=False)
	compt = db.Column(db.String(1024), unique=False, nullable=False)
	lang = db.Column(db.String(1024), unique=False, nullable=False)
	electronic_mail = db.Column(db.String(256), unique=False, nullable=False)

class Contact(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	ref = db.Column(db.String(128), unique=True, nullable=False)
	name = db.Column(db.String(256), unique=False, nullable=False)
	electronic_mail = db.Column(db.String(256), unique=False, nullable=False)
	message = db.Column(db.String(256), unique=False, nullable=False)    

jwt = JWTManager(app)
init_context(app, db)

# Temporary:
usernames = [
	"alice", "bob", "carol", "dave", "eve",
	"frank", "grace", "heidi", "ivan", "judy"
]

emails = [f"{name}@example.com" for name in usernames]
password = "password123"

skills_pool = ["Python", "JavaScript", "C++", "Java", "React", "Django", "Flask", "SQL", "HTML", "CSS"]
languages_pool = ["English", "French", "Spanish", "German", "Chinese", "Japanese", "Arabic", "Russian"]

project_names = [
	"Website Builder", "Chat App", "Inventory System", "Portfolio", "Blog Platform",
	"Task Manager", "E-commerce Site", "Game Engine", "Social Media App", "Analytics Dashboard"
]

@app.route("/all", methods=["POST"])
def all():
	for i in range(10):
		compt = ";".join(random.sample(skills_pool, k=random.randint(2, 5)))
		lang = ";".join(random.sample(languages_pool, k=random.randint(1, 3)))
		user = User(
			username=usernames[i],
			electronic_mail=emails[i],
			password=password,
			compt=compt,
			lang=lang
		)
	db.session.add(user)
	db.session.commit()

	return jsonify({"success_message": "All added"}), 200

@app.route("/signup", methods=["POST"])
def signup():
	username = request.json.get("username", None)
	electronic_mail = request.json.get("electronic_mail", None)
	password = request.json.get("password", None)
	if(not(electronic_mail) or not(password) or  not(username)): return jsonify({"error_message": "Received no credentials"}), 401

	try:
		user = User(username=username, electronic_mail=electronic_mail, password=bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8"), compt="", lang="") 
		db.session.add(user)
		db.session.commit()
	except Exception as exception:
		print(f"Couldn't save the user: {electronic_mail}\n{exception}")
		return jsonify({"error_message": "Couldn't save the user data"}), 401

	return jsonify({"success_message": "Account created"}), 200

@app.route("/signin", methods=["POST"])
def signin():
	electronic_mail = request.json.get("electronic_mail", None)
	password = request.json.get("password", None)
	if(not(electronic_mail) or not(password)): return jsonify({"error_message": "Received no credentials"}), 401

	saved_user = User.query.filter_by(electronic_mail=electronic_mail).first()
	if(saved_user is None):
		print(f"User didn't sign in: {electronic_mail}")
		return jsonify({"error_message": "The user does not exist"}), 401

	if(bcrypt.checkpw(password.encode("utf-8"), saved_user.password.encode("utf-8"))):
		access_token = create_access_token(identity=electronic_mail)
		response = make_response(jsonify(msg="Signed in"))
		response.set_cookie("ctoken", access_token, httponly=True, secure=False, samesite="Strict")
		print(f"User signed in: {electronic_mail}")
		return response
	else:
		return jsonify({"error_message": "Bad credentials"}), 401

@app.route("/signout", methods=["POST"])
def logout():
	response = make_response(jsonify(msg="Signed out"))
	response.delete_cookie("ctoken")
	return response

@app.route("/decode", methods=["GET"])
@jwt_required()
def me():
	electronic_mail = get_jwt_identity()
	user = User.query.filter_by(electronic_mail=electronic_mail).first()
	return jsonify({
		"email": user.electronic_mail,
		"username": user.username,
	})

@app.route("/add_proj", methods=["POST"])
@jwt_required
def add_proj():
	electronic_mail = get_jwt_identity()
	proj_name = request.json.get("name", None)
	proj_compt = request.json.get("compt", None)
	proj_lang = request.json.get("lang", None)
	project = Project(name=proj_name, compt=proj_compt, lang=proj_lang, electronic_mail=electronic_mail)
	

@app.route("/add_compt", methods=["POST"])
@jwt_required()
def add_compt():
	electronic_mail = get_jwt_identity()
	new_compt = request.json.get("compt", None)
	user = User.query.filter_by(electronic_mail=electronic_mail).first()
	if(user.compt == ""):
		user.compt = new_compt
	else:
		user.compt = f"{user.compt};{new_compt}"
		
	db.session.commit()
	return jsonify({"success_message": "Added compt"}), 200

@app.route("/get_compt", methods=["GET"])
@jwt_required()
def get_compt():
	electronic_mail = get_jwt_identity()
	user = User.query.filter_by(electronic_mail=electronic_mail).first()
	return jsonify({
		"compt": user.compt,
	}), 200

@app.route("/add_lang", methods=["POST"])
@jwt_required()
def add_lang():
	electronic_mail = get_jwt_identity()
	new_lang = request.json.get("lang", None)
	user = User.query.filter_by(electronic_mail=electronic_mail).first()
	if(user.lang == ""):
		user.lang = new_lang
	else:
		user.lang = f"{user.lang};{new_lang}"
		
	db.session.commit()
	return jsonify({"success_message": "Added lang"}), 200
		
@app.route("/get_lang", methods=["GET"])
@jwt_required()
def get_lang():
	electronic_mail = get_jwt_identity()
	user = User.query.filter_by(electronic_mail=electronic_mail).first()
	return jsonify({
		"lang": user.lang,
	}), 200
 
@app.route("/get_info", methods=["GET"])
@jwt_required()
def get_info():
	electronic_mail = get_jwt_identity()
	user = User.query.filter_by(electronic_mail=electronic_mail).first()
	return jsonify({
		"compt": user.compt,
		"lang": user.lang,
	}), 200
 
@app.route("/add_project", methods=["POST"])
@jwt_required()
def add_project():
	electronic_mail = get_jwt_identity()

	name = request.json.get("name", "")
	compt_list = request.json.get("compt", []) 
	lang_list = request.json.get("lang", []) 

	compt_str = ";".join([s.strip() for s in compt_list])
	lang_str = ";".join([l.strip() for l in lang_list])

	new_project = Project(
		name=name,
		compt=compt_str,
		lang=lang_str,
		electronic_mail=electronic_mail
	)

	db.session.add(new_project)
	db.session.commit()

	return jsonify({"success_message": "Project created"}), 200

@app.route("/get_projects", methods=["GET"])
@jwt_required()
def get_projects():
    electronic_mail = get_jwt_identity()
    projects = Project.query.filter_by(electronic_mail=electronic_mail).all()

    projects_json = []
    for p in projects:
        user = User.query.filter_by(electronic_mail=p.electronic_mail).first()
        projects_json.append({
            "id": p.id,
            "name": p.name,
            "compt": p.compt,
            "lang": p.lang,
            "electronic_mail": p.electronic_mail,
            "username": user.username if user else "Unknown"
        })

    return jsonify(projects_json), 200


@app.route("/recommend_projects", methods=["GET"])
@jwt_required()
def recommend_projects():
    electronic_mail = get_jwt_identity()
    current_user = User.query.filter_by(electronic_mail=electronic_mail).first()
    user_skills = set(current_user.compt.split(";")) if current_user.compt else set()
    user_langs = set(current_user.lang.split(";")) if current_user.lang else set()

    all_projects = Project.query.filter(Project.electronic_mail != electronic_mail).all()
    
    recommendations = []
    for proj in all_projects:
        proj_skills = set(proj.compt.split(";")) if proj.compt else set()
        proj_langs = set(proj.lang.split(";")) if proj.lang else set()
        score = len(user_skills & proj_skills) + len(user_langs & proj_langs)
        if score > 0:
            owner = User.query.filter_by(electronic_mail=proj.electronic_mail).first()
            recommendations.append({
                "id": proj.id,
                "name": proj.name,
                "compt": proj.compt,
                "lang": proj.lang,
                "electronic_mail": proj.electronic_mail,
                "username": owner.username if owner else "Unknown",
                "score": score
            })

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return jsonify(recommendations), 200

@app.route("/verify", methods=["GET"])
@jwt_required()
def verify():
	current_user = get_jwt_identity()
	return jsonify(logged_in_as=current_user), 200

if __name__ == "__main__":
	app.run(debug=True)
