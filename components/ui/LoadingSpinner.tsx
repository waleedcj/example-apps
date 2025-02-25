import * as React from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Stop, SvgProps } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: animateTransform */

const AnimatedPath = Animated.createAnimatedComponent(Path);

function animateTransform({ type, from, to, dur, repeatCount }: any) {
  const duration = parseFloat(dur.slice(0, -1)) * 1000;
  const [fromAngle, fromCX, fromCY] = from.split(' ').map(Number);
  const [toAngle, toCX, toCY] = to.split(' ').map(Number);
  const t = new Animated.Value(0);
  const animateTransform = [
    Animated.timing(t, {
      duration,
      toValue: 1,
      useNativeDriver: true,
      easing: Easing.linear,
    }),
  ];
  const animation = Animated.loop(Animated.sequence(animateTransform), {
    iterations: -1,
  }).start();
  const rotateAngle = t.interpolate({
    inputRange: [0, 1],
    outputRange: [fromAngle + 'deg', toAngle + 'deg'],
  });
  const cx = t.interpolate({
    inputRange: [0, 1],
    outputRange: [fromCX, toCX],
  });
  const cy = t.interpolate({
    inputRange: [0, 1],
    outputRange: [fromCY, toCY],
  });
  const icx = t.interpolate({
    inputRange: [0, 1],
    outputRange: [-fromCX, -toCX],
  });
  const icy = t.interpolate({
    inputRange: [0, 1],
    outputRange: [-fromCY, -toCY],
  });
  const style = {
    transform: [
      { translateX: cx },
      { translateY: cy },
      { rotateZ: rotateAngle },
      { translateX: icx },
      { translateY: icy },
    ],
  };
  return { t, animation, style, rotateAngle, cx, cy, icx, icy };
}

const LoadingSpinnerSVG = (props: SvgProps) => {
  const { style } = animateTransform({
    type: 'rotate',
    from: '0 18 18',
    to: '360 18 18',
    dur: '1s',
    repeatCount: 'indefinite',
  });
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" {...props}>
      <Defs>
        <LinearGradient id="a" x1="8.042%" x2="65.682%" y1="0%" y2="23.865%">
          <Stop stopColor={props.color ?? '#fff'} offset="0%" stopOpacity={0} />
          <Stop stopColor={props.color ?? '#fff'} offset="63.146%" stopOpacity={0.631} />
          <Stop stopColor={props.color ?? '#fff'} offset="100%" />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" transform="translate(1 1)">
        {/* @ts-ignore */}
        <AnimatedPath
          stroke="url(#a)"
          strokeWidth={4}
          d="M36 18c0-9.94-8.06-18-18-18"
          // @ts-ignore
          style={style}
          translateX={18.8}
          translateY={18.8}
        ></AnimatedPath>
      </G>
    </Svg>
  );
};
export default LoadingSpinnerSVG;
