import React from 'react';
import LiskHubExtensions from './liskHubExtensions';

export const loadRemoteComponent = (url) => {
  return fetch(url)
  .then(res=>res.text())
  .then(source=>{
    var exports = {}
    function require(name){

      if(name == 'react') return React 
      // else throw `You can't use modules other than "react" in remote component.`
      if(name == 'LiskHubExtensions') return LiskHubExtensions
    }
    // const transformedSource = transform(source, {
    //   presets: ['react', 'es2015', 'stage-2']
    // }).code
    // console.log(transformedSource, 'transformedSource');
    // eval(transformedSource)
    eval(source);
    // traverse(componentRegistry, this.componentName);
    // return source;
    return exports.__esModule ? exports.default : exports
  })
}