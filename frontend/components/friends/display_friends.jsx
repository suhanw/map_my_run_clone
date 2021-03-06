import React from 'react';
import {Switch} from 'react-router-dom';
import FriendIndexContainer from './friend_index_container';
import {ProtectRoute} from '../../util/route_util';
import {randomizer} from '../../util/randomizer';
import UserSearchContainer from './user_search_container';
import SectionNav from '../section_nav';

class DisplayFriends extends React.Component {
  render() {
    const adGifClass = `ad-gif-${randomizer(3, 1)}`;
    const sectionNavTabs = ['/friends', '/friends/find'];
    return (
      <section className="display-friends-container">
        <h2>MY FRIENDS</h2>
        <SectionNav sectionNavTabs={sectionNavTabs}/>
        <Switch>
          <ProtectRoute path="/friends/find" component={UserSearchContainer} />
          <ProtectRoute path="/friends" component={FriendIndexContainer} />
        </Switch>
        <aside className="workout-show-sidebar">
          <div className={adGifClass}>
            <small>Ad</small>
            <small>Rent this movie somewhere near you.</small>
          </div>
        </aside>
      </section>
    );
  }
}

export default DisplayFriends;
