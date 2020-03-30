import React from 'react';
import reactStringReplace from 'react-string-replace';

const TweetParser = ({ children }) => {
  const REGEX_USER = /\B(@[a-zA-Z0-9_]+)/g; // regex for @users
  const REGEX_HASHTAG = /\B(#[Ã¡-ÃºÃ-ÃÃ¤-Ã¼Ã-Ãa-zA-Z0-9_]+)/g; // regex for #hashtags
  const textWithHashtag = reactStringReplace(children, REGEX_HASHTAG, (hashtag, i) => (
    <a key={hashtag + i} href={`https://twitter.com/hashtag/${hashtag.slice(1)}`} target="_blank">
      {hashtag}
    </a>
  ));
  const textWithUsers = reactStringReplace(textWithHashtag, REGEX_USER, (user, i) => (
    <a key={user + i} href={`https://twitter.com/${user.slice(1)}`} target="_blank">
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
