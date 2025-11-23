import { useSwipeable } from 'react-swipeable';

export const useSwipeGesture = (onSwipeLeft, onSwipeRight) => {
  return useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });
};

