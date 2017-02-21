class Squash < ActiveRecord::Migration[5.0]
  def change
  	create_table "games", force: :cascade do |t|
    t.string   "name"
    t.boolean "in_progress", default: true
    t.text     "history"
    t.integer "move", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "webid", null: false
  end

  create_table "involvements", force: :cascade do |t|
    t.integer  "game_id"
    t.integer  "player_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean  "color"
    t.string   "result"
    t.index ["game_id"], name: "index_involvements_on_game_id"
    t.index ["player_id"], name: "index_involvements_on_player_id"
  end

  create_table "players", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "password_digest"
    t.string   "remember_digest"
    t.index ["email"], name: "index_players_on_email", unique: true
    t.index ["name"], name: "index_players_on_name", unique: true
  end
  end
end
