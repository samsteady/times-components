import * as React from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
  PixelRatio,
  View
} from 'react-native';
import Url from 'url-parse';
import logoPath from '../assets/t.png';
import { appendToImageURL } from '@times-components/utils';
import findClosestWidth from './utils/findClosestWidth';
import styles from './styles';

interface ResponsiveImageProps {
  readonly aspectRatio?: number;
  readonly onImagePress?: () => void;
  readonly caption?: JSX.Element;
  readonly uri: string;
  readonly relativeHeight?: number;
  readonly relativeHorizontalOffset?: number;
  readonly relativeVerticalOffset?: number;
  readonly relativeWidth?: number;
  readonly resizeMode?: ImageStyle['resizeMode'];
  readonly rounded?: boolean;
  readonly style?: any;
  readonly onLayout?: (ev: any) => {};
  readonly onError?: () => void;
  readonly disablePlaceholder?: boolean;
}

interface ElementProps {
  readonly source: ImageSourcePropType;
  readonly onLoadEnd?: () => void;
  readonly onLoad?: () => void;
  readonly aspectRatio?: ResponsiveImageProps['aspectRatio'];
  readonly borderRadius: number;
  readonly resize: ImageStyle['resizeMode'];
  readonly fadeDuration: number;
  readonly onError?: () => void;
}

const ImageElement = ({
  source,
  onLoadEnd,
  onLoad,
  aspectRatio,
  borderRadius,
  resize,
  fadeDuration,
  onError
}: ElementProps) => (
  <Image
    fadeDuration={fadeDuration}
    source={source}
    onLoadEnd={onLoadEnd}
    onLoad={onLoad}
    onError={onError}
    resizeMethod={'resize'}
    style={{
      aspectRatio,
      borderRadius,
      ...styles.imageStyle,
      resizeMode: resize
    }}
  />
);

const ResponsiveImage = (props: ResponsiveImageProps) => {
  const {
    uri,
    aspectRatio,
    style: propStyle,
    relativeHeight = 1,
    relativeHorizontalOffset = 0,
    relativeVerticalOffset = 0,
    relativeWidth = 1,
    resizeMode,
    rounded,
    onLayout,
    onError
  } = props;

  if (!uri) {
    return null;
  }
  const borderRadius = rounded ? 9999 : 0;

  const url: Url = new Url(uri, true);
  if (!uri.includes('data:')) {
    url.query.rel_width = (relativeWidth || 1).toString();
    url.query.rel_height = (relativeHeight || 1).toString();
    url.query.rel_vertical_offset = relativeVerticalOffset
      ? relativeVerticalOffset.toString()
      : '0';
    url.query.rel_horizontal_offset = relativeHorizontalOffset
      ? relativeHorizontalOffset.toString()
      : '0';
    url.query.offline = 'true';
  }
  const offlineUrl = url.toString();
  const [width, setWidth] = React.useState(0);
  url.query.offline = 'false';
  const onlineUrl = url.toString();

  const [showOffline, setShowOffline] = React.useState(false);
  const [showOnline, setShowOnline] = React.useState(false);
  const [showPlaceholder, setShowPlaceholder] = React.useState(true);
  const [checkedCache, setCheckedCache] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(
    () => {
      if ('queryCache' in Image && width && !checkedCache) {
        const cache =
          Image.queryCache && Image.queryCache([onlineUrl, offlineUrl]);
        setCheckedCache(true);
        if (!cache) {
          return;
        }
        cache.then(results => {
          if (onlineUrl in results) {
            setShowOnline(true);
            setShowOffline(false);
            setShowPlaceholder(false);
            return;
          }
          if (offlineUrl in results) {
            setShowOffline(true);
            setShowPlaceholder(false);
          }
        });
      }
    },
    [width]
  );

  const imageRef = React.useCallback(event => {
    const { width } = event.nativeEvent.layout;

    setWidth(width);
    if (onLayout) {
      onLayout(event);
    }
  }, []);

  if (!width || !checkedCache) {
    return (
      <ImageBackground
        onLayout={imageRef}
        source={logoPath}
        fadeDuration={0}
        imageStyle={{
          ...styles.imageStyle,
          borderRadius,
          resizeMode: 'center'
        }}
        style={{
          ...styles.style,
          ...propStyle,
          aspectRatio,
          borderRadius
        }}
      />
    );
  }

  const resize = resizeMode || 'cover';
  const ratio = PixelRatio.get();
  const closestWidth = width && findClosestWidth(width * ratio);

  const highRes = showOnline && (
    <ImageElement
      key="online"
      source={{ uri: appendToImageURL(onlineUrl, 'resize', closestWidth) }}
      aspectRatio={aspectRatio}
      borderRadius={borderRadius}
      onLoad={() => {
        setShowOffline(false);
      }}
      onError={() => {
        setShowOnline(false);
        setShowOffline(true);
        setFailed(true);
        if (onError) {
          onError();
        }
      }}
      resize={resize}
      fadeDuration={0}
    />
  );
  const lowRes = showOffline && (
    <ImageElement
      key="offline"
      source={{ uri: appendToImageURL(offlineUrl, 'resize', closestWidth) }}
      aspectRatio={aspectRatio}
      borderRadius={borderRadius}
      onLoadEnd={() => {
        if (!failed) {
          setShowOnline(true);
        }
        setShowPlaceholder(false);
      }}
      onError={() => {
        if (onError) {
          onError();
        }
        setShowOffline(false);
        setFailed(true);
        setShowPlaceholder(true);
      }}
      resize={resize}
      fadeDuration={0}
    />
  );
  const placeholder = showPlaceholder && (
    <Image
      key="placeholder"
      source={logoPath}
      borderRadius={0}
      onLoadEnd={() => {
        if (!failed) {
          setShowOffline(true);
        }
      }}
      fadeDuration={0}
      style={{ resizeMode: 'center', width, height: '100%' }}
    />
  );

  return (
    <View style={{ ...styles.style, ...propStyle, aspectRatio, borderRadius }}>
      {placeholder}
      {lowRes}
      {highRes}
    </View>
  );
};

export default ResponsiveImage;
