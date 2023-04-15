import Vue2TouchEvents from 'vue2-touch-events'

export default ({ Vue }) => {
  Vue.use(Vue2TouchEvents, {
    disableClick: false,
    touchClass: '',
    tapTolerance: 10,
    touchHoldTolerance: 400,
    swipeTolerance: 50,
    longTapTimeInterval: 400
  })
};
