import React from 'react';
import reactStringReplace from 'react-string-replace';

const TweetParser = ({ children }) => {
  const REGEX_USER = /\B(@[a-zA-Z0-9_]+)/g; // regex for @users
  const REGEX_HASHTAG = /\B(#[A-Za-z0-9-_]+)/g; // regex for #hashtags
  const textWithHashtag = reactStringReplace(children, REGEX_HASHTAG, (hashtag, i) => (
    <a
      key={hashtag + i}
      href={`https://twitter.com/hashtag/${hashtag.slice(1)}`}
      target="_blank"
      className="hashtag"
    >
      {hashtag}
    </a>
  ));
  const textWithUsers = reactStringReplace(textWithHashtag, REGEX_USER, (user, i) => (
    <a
      key={user + i}
      href={`https://twitter.com/${user.slice(1)}`}
      target="_blank"
      className="user"
    >
      {user}
    </a>
  ));
  return (
    <span>
      {
        textWithUsers
      }
    </span>
  );
};
export default TweetParser;
