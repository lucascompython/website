from flask import Flask, redirect, url_for, render_template, request, session, flash
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from bot import bot


app = Flask(__name__)
app.register_blueprint(bot, url_prefix="")
#secret key para algumas drenas provavelmente sessions
app.secret_key = "steamcsgotf2"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
#guardar login durante um x amounte de tempo
app.permanent_session_lifetime = timedelta(days=5)




db = SQLAlchemy(app)

class users(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))

    def __init__(self, name, email):
        self.name = name
        self.email = email





@app.route("/")
@app.route("/home/")
def home():
    return render_template("index.html")


@app.route("/programming/")
def programming():
    return render_template("programming.html")


@app.route("/hacking/")
def hacking():
    return render_template("hacking.html")






"""
@app.route("/view")
def view():
    return render_template("view.html", values=users.query.all())


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        session.permanent = True
        user = request.form["nm"]
        session["user"] = user

        

        found_user = users.query.filter_by(name=user).first()
        if found_user:
            session["email"] = found_user.email

        else:
            usr = users(user, "")
            db.session.add(usr)
            db.session.commit()

        flash("LOgin seccseasdas")
        return redirect(url_for("user"))
    else:
        if "user" in session:
            flash("Ja tas logado!")
            return redirect(url_for("user"))
        return render_template("login.html")





@app.route("/user", methods=["POST", "GET"])
def user():
    email = None

    if "user" in session:
        user = session["user"]

        if request.method == "POST":
            email = request.form["email"]
            session["email"] = email
            found_user = users.query.filter_by(name=user).first()
            found_user.email = email
            db.session.commit()
            flash("Email foi salvado!")
        else:
            if "email" in session:
                email = session["email"]

        return render_template("user.html", email=email)
    else:
        flash("Tu nao tas logado!")
        return redirect(url_for("login"))


@app.route("/logout")
def logout():
    
    if "user" in session:
        user = session["user"]
        flash(f"desLogado com sucesso {user}", "info")
    session.pop("user", None)
    session.pop("email", None)
    return redirect(url_for("login"))
"""



if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)



 


##### optimazing the site with php and js code instad of python code

#create a supoprt feature with email, the user logins and can elave a idea or a bug and i will have a bota that will send me an email with thei email name with the content

#### mostrar no site informaçao do bot tipo os servers e essas drenas
