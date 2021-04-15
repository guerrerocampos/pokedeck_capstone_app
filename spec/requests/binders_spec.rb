require 'rails_helper'

RSpec.describe "Binders", type: :request do
  describe "GET /binders" do
    it 'gets a list of binders' do
      #arrange
      user1 =User.create(
        email:"userone@noemail.com",
        password:"password",
        username:"userone"
      )
      card1 = Card.create(
        name: "Alakazam",
        pokemon_type: "Psychic",
        set_id: "base1",
        set_name: "Base",
        set_series: "Base",
        number: "1",
        rarity: "Rare Holo",
        image: "https://images.pokemontcg.io/base1/1_hires.png",
        price: 250
      )
      Binder.create(
        user_id:user1.id,
        card_id:card1.id,
        quantity:1,
        favorite:true
      )
      #act
      get '/binders'
      #assert
      binder_response = JSON.parse(response.body)
      expect(response).to have_http_status(200)
      expect(binder_response.length).to eq 1
      first_binder = binder_response.first
      expect(first_binder['quantity']).to eq 1
      expect(first_binder['favorite']).to eq true
    end
  end
  describe "PUT /binders/:id" do
    it "updates a binder" do
      #arrange
      user1 =User.create(
        email:"userone@noemail.com",
        password:"password",
        username:"userone"
      )
      card1 = Card.create(
        name: "Alakazam",
        pokemon_type: "Psychic",
        set_id: "base1",
        set_name: "Base",
        set_series: "Base",
        number: "1",
        rarity: "Rare Holo",
        image: "https://images.pokemontcg.io/base1/1_hires.png",
        price: 250
      )
      binder1 = Binder.create(
        user_id:user1.id,
        card_id:card1.id,
        quantity:1,
        favorite:true
      )

      update_binder_params = {
        binder: {
          quantity: 2,
          favorite: false
        }
      }
      #Act
      put "/binders/#{binder1.id}", params: update_binder_params

      #assert
      updated_binder_response = JSON.parse(response.body)
      expect(updated_binder_response['quantity']).to eq 2
      expect(updated_binder_response['favorite']).to eq false
      expect(response).to have_http_status(200)
    end
  end
end
