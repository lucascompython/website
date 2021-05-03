from flask import Blueprint, render_template, session, request

bot = Blueprint("bot", __name__, static_folder="static", template_folder="templates")



@bot.route("/bot/", methods=["POST", "GET"])
def discord_bot():
    if request.method == "POST":
        return render_template("bot.html", drena="comi a tua mae")
    return render_template("bot.html")




@bot.route("/bot/info/")
def bot_info():
    return render_template("bot-info.html")




@bot.route("/bot/gui/")
def bot_gui():
    return render_template("bot-gui.html")

