import React from 'react';
import ReactEmoji from 'react-emoji';
import marked from 'marked';
import Textarea from 'react-textarea-autosize';

const parseTime = (timestamp) => {
  let a = new Date(timestamp);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
};

// NOTE => MARKED SETUP:

// ALLOWS LINE BREAKS WITH RETURN BUTTON
marked.setOptions({
  breaks: true,
});

// INSERTS target="_blank" INTO HREF TAGS (required for codepen links)
const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  if (!href.startsWith('http')) {
    return `<a target="_blank" href="https://${href}">${text}</a>`;
  } else {
    return `<a target="_blank" href="${href}">${text}</a>`;
  }
}

export default ({
  path,
  like,
  chat,
  user,
  edit,
  mentors,
  setEdit,
  saveEdit,
  editText,
  finishEdit,
  reciepient,
  onlineStatus,
  deleteMessage,
  initiatePrivateChat }) => {
  if (chat.size > 0) {
    return (
      <div className='chatMessage'>
        {chat.map(msg => {
          const id = msg.get('id');
          const timestamp = msg.get('timestamp');
          const text = msg.get('text');
          const author = msg.get('author');
          const avatar = msg.get('avatar');
          const likes = msg.get('likes');
          return (
            <div className="comment" key={id} style={{ paddingTop: '12px' }}>

              <a className="avatar">
                <img src={avatar} alt={`${author}'s Avatar'`}/>
              </a>

              <div className="content">

                { path && author !== user.username ?
                  <span
                    onClick={initiatePrivateChat.bind(this, author)}
                    className='author author-link'>
                    {author}
                    {mentors.has(author) && <i className="student icon mentorIcon"></i>}
                    {onlineStatus.has(author) && <i className="star icon onlineIcon"></i>}
                  </span>
                    :
                  <span className='author author-link-inactive'>
                    {author}
                    {mentors.has(author) && <i className="student icon mentorIcon"></i>}
                    {onlineStatus.has(author) && <i className="star icon onlineIcon"></i>}
                  </span> }

                <div className="metadata">
                  <span className="date">at
                    <span className="timeStamp"> {parseTime(timestamp)} </span>
                  </span>
                  {user.username === author &&
                    <span className='editButton' onClick={setEdit.bind(this, id)}>edit</span>}
                </div>

                {edit === id ?

                <form
                  className="ui form"
                  style={{ marginTop: '10px' }}>
                  <Textarea
                    rows={1}
                    maxRows={10}
                    id="editInput"
                    autoFocus
                    type="text"
                    placeholder="You should really type something..."
                    value={editText}
                    onChange={saveEdit.bind(this)} />
                  <button className="ui green button" disabled={!editText} onClick={finishEdit}>Save Edit</button>
                  <button className="ui red button" onClick={deleteMessage.bind(this, id)}>Delete Message</button>
                </form>

                :

                <div
                  className="text"
                  style={{ marginTop: '4px' }}>
                  {text.split(' ').map((word, idx) => {
                    if (word.charAt(0) === ':' && word.charAt(word.length - 1) === ':') {
                      return <span key={word + idx}>{ReactEmoji.emojify(word)}</span>
                    } else {
                      return <span key={word + idx} dangerouslySetInnerHTML={{__html: marked(word, { renderer: renderer })}} />
                    }
                  })}
                </div>}

                <div className="ui feed" style={{ marginTop: '0px' }}>
                  <div className="event">
                    <div className="content">
                      <div className="meta">
                        {!likes.has(user.username) ?
                          <a className="like" onClick={like.bind(this, id, user.username, reciepient)}>
                            <i className="like icon"></i> {likes.size} {likes.size === 1 ? 'Like' : 'Likes'}
                          </a>
                            :
                          <a className="like">
                            <i className="like icon" style={{ color: 'red' }}></i> {likes.size} {likes.size === 1 ? 'Like' : 'Likes'}
                          </a>}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            )
          })
        }
      </div>
    );
  } else {
    return (
      <div>
        <b>There are no messages yet... why not add one?</b>
      </div>
    );
  }
};
