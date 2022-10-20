import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentNode } from '../store/selectors';
import { setApplicationNode } from '../store/action';

export const useCurrentNode = () => {
  const dispatch = useDispatch();
  const currentNode = useSelector(selectCurrentNode);

  const setCurrentNode = useCallback((node) => {
    dispatch(setApplicationNode(node));
  }, []);

  return { currentNode, setCurrentNode };
};
