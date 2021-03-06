# == Schema Information
#
# Table name: likes
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  likable_type :string           not null
#  likable_id   :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Like < ApplicationRecord
  validates :user, :likable, presence: true
  validates :user, uniqueness: {scope: :likable}

  belongs_to :likable, polymorphic: true
  belongs_to :user

  has_one :notification, as: :notifiable, dependent: :destroy

end
