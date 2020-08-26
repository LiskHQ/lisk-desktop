const flushPromises = () => new Promise(setImmediate);

export default flushPromises;
