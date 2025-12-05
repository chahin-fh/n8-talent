from sqlalchemy_utils import database_exists, create_database

def set_config(app):
	app.config["JWT_SECRET_KEY"] = "jwtauthforflask"
	app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
	app.config["JWT_ACCESS_COOKIE_NAME"] = "ctoken"
	app.config["JWT_COOKIE_CSRF_PROTECT"] = False
	app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://carbon:carbon123@localhost:3306/flask_db"
	app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

def init_context(app, db):
	with app.app_context():
		if(not database_exists(db.engine.url)): create_database(db.engine.url)
		db.drop_all()
		db.create_all()
