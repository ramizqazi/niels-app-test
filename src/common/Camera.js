import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Camera as RNVCAMERA } from 'react-native-vision-camera';
import Orientation from 'react-native-orientation-locker';

import View from './View';

const { width: W, height: H } = Dimensions.get('screen');

/* =============================================================================
<Camera />
============================================================================= */
const Camera = React.forwardRef(
  ({ device, isActive, codeScanner, ...props }, myCamera) => {
    const [orientation, setOrientation] = useState('PORTRAIT');
    const width = Math.max(W, H);
    const height = Math.min(W, H);

    useEffect(() => {
      Orientation.addOrientationListener(orie => setOrientation(orie));
    }, []);

    return (
      <>
        {orientation === 'PORTRAIT' ? (
          <RNVCAMERA
            device={device}
            ref={myCamera}
            photo={true}
            focusable={true}
            isActive={isActive}
            style={styles.camera}
            codeScanner={codeScanner}
            {...props}
          />
        ) : (
          <View
            style={{
              transform: [
                orientation === 'LANDSCAPE-RIGHT'
                  ? { rotate: '-90deg' }
                  : { rotate: '90deg' },
              ],
              width: height,
              height: width,
              position: 'absolute',
              left: width / 2 - height / 2,
              top: height / 2 - width / 2,
            }}>
            <RNVCAMERA
              device={device}
              ref={myCamera}
              photo={true}
              focusable={true}
              orientation={
                orientation === 'LANDSCAPE-RIGHT'
                  ? 'landscape-right'
                  : 'landscape-left'
              }
              isActive={isActive}
              style={{ width: height, height: width }}
              codeScanner={codeScanner}
              {...props}
            />
          </View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  camera: {
    width: '100%',
    height: '100%',
  },
});

/* Export
============================================================================= */
export default Camera;
