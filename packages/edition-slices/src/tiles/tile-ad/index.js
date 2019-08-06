import React from "react";
import PropTypes from "prop-types";
import { editionBreakpoints } from "@times-components/styleguide";
import Image from "@times-components/image";
import {
  getTileImage,
  TileLink,
  TileSummary,
  withTileTracking
} from "../shared";
import styleFactory from "./styles";

const TileAD = ({ onPress, tile, breakpoint }) => {
  const styles = styleFactory(breakpoint);
  const { container, headline, imageContainer, summaryContainer } = styles;
  const crop = getTileImage(tile, "crop32");

  return (
    <TileLink onPress={onPress} style={container} tile={tile}>
      {breakpoint !== editionBreakpoints.medium && (
        <Image
          aspectRatio={3 / 2}
          relativeWidth={crop.relativeWidth}
          relativeHeight={crop.relativeHeight}
          relativeHorizontalOffset={crop.relativeHorizontalOffset}
          relativeVerticalOffset={crop.relativeVerticalOffset}
          style={imageContainer}
          uri={crop.url}
        />
      )}
      <TileSummary
        headlineStyle={headline}
        style={summaryContainer}
        tile={tile}
      />
    </TileLink>
  );
};

TileAD.propTypes = {
  breakpoint: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  tile: PropTypes.shape({}).isRequired
};

TileAD.defaultProps = {
  breakpoint: editionBreakpoints.small
};

export default withTileTracking(TileAD);
