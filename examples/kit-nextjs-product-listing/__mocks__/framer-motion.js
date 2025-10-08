// Mock framer-motion
const React = require('react');

const motion = new Proxy(
  {},
  {
    get(target, prop) {
      return React.forwardRef((props, ref) =>
        React.createElement(prop, { ...props, ref })
      );
    },
  }
);

module.exports = {
  motion,
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({}),
  useMotionValue: (initial) => ({ current: initial }),
  useTransform: () => ({ current: 0 }),
  useSpring: () => ({ current: 0 }),
  useMotionTemplate: (...args) => {
    // Return a function that acts like a template literal
    return `motion-template-${args.join('-')}`;
  },
  useScroll: () => ({
    scrollYProgress: { current: 0 },
    scrollY: { current: 0 },
  }),
  useInView: () => false,
};
