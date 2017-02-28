class Squash < ActiveRecord::Migration[5.0]
	def change
		create_table "games", force: :cascade do |t|
			t.boolean "in_progress", default: false
			t.text "history"
			t.integer "move", default: 0, null: false
			t.datetime "created_at", null: false
			t.datetime "updated_at", null: false
			t.string "webid", null: false
			t.integer "timer"
			t.integer "inc"
			t.boolean "completed", default: false
			t.string "result"
			t.integer "ko"
		end

		create_table "involvements", force: :cascade do |t|
			t.integer "game_id"
			t.integer "player_id"
			t.datetime "created_at", null: false
			t.datetime "updated_at", null: false
			t.boolean "color"
			t.boolean "winner"
			t.index ["game_id"], name: "index_involvements_on_game_id", using: :btree
			t.index ["player_id"], name: "index_involvements_on_player_id", using: :btree
		end

		create_table "players", force: :cascade do |t|
			t.string "name"
			t.datetime "created_at", null: false
			t.datetime "updated_at", null: false
			t.string "password_digest"
			t.string "remember_digest"
			t.boolean "anonymous", default: false
			t.string "display_name"
			t.index ["name"], name: "index_players_on_name", unique: true, using: :btree
		end
	end
end
