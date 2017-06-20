# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170620175810) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "games", force: :cascade do |t|
    t.boolean  "in_progress", default: false
    t.text     "history"
    t.integer  "move",        default: 0,     null: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "webid",                       null: false
    t.integer  "timer"
    t.integer  "inc"
    t.boolean  "completed",   default: false
    t.string   "result"
    t.integer  "ko"
    t.boolean  "private",     default: false
    t.text     "messages"
  end

  create_table "involvements", force: :cascade do |t|
    t.integer  "game_id"
    t.integer  "player_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean  "color"
    t.boolean  "winner"
    t.boolean  "draw"
    t.integer "score", default: 0
    t.integer "timer"
    t.index ["game_id"], name: "index_involvements_on_game_id", using: :btree
    t.index ["player_id"], name: "index_involvements_on_player_id", using: :btree
  end

  create_table "players", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "password_digest"
    t.string   "remember_digest"
    t.boolean  "anonymous",       default: false
    t.string   "display_name"
    t.index ["name"], name: "index_players_on_name", unique: true, using: :btree
  end

end
